#!/bin/bash

################################################################################
#                                                                              #
#                    TOP FINANCE - COMPLETE STARTUP SCRIPT                    #
#                                                                              #
#  This script automates the complete initialization of the Top Finance       #
#  project for evaluators. It handles:                                        #
#  - Dependency verification and installation                                 #
#  - Database setup and migrations                                            #
#  - Backend service compilation and startup                                  #
#  - Frontend build and startup                                               #
#                                                                              #
################################################################################

set -e

# ============================================================================
# CLEANUP ON EXIT
# ============================================================================

cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"

    # Try pkill first (Linux/Mac), then taskkill (Windows)
    if command -v pkill &> /dev/null; then
        pkill -f 'node dist/main.js' || true
        pkill -f 'npm run dev' || true
        pkill -f 'serve_cors.py' || true
        pkill -f 'python3 serve_cors' || true
        pkill -f 'serve.*5174' || true
        pkill -f 'serve.*5175' || true
    else
        # Windows fallback
        taskkill /F /IM node.exe 2>/dev/null || true
        taskkill /F /IM python.exe 2>/dev/null || true
    fi

    sleep 1
    echo -e "${GREEN}✅ All services stopped${NC}"
}

trap cleanup EXIT

# ============================================================================
# CONFIGURATION
# ============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECTS=("top-users" "top-finance" "api-gateway" "top-frontend" "top-frontend-users" "top-frontend-finance")
BACKEND_PROJECTS=("top-users" "top-finance" "api-gateway")
FRONTEND_PROJECTS=("top-frontend" "top-frontend-users" "top-frontend-finance")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════════════════╗"
    echo "║  $1"
    echo "╚════════════════════════════════════════════════════════════════════════════╝"
    echo ""
}

print_step() {
    echo -e "${BLUE}📍 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        print_error "$1 is not installed"
        return 1
    fi
    print_success "$1 is installed"
    return 0
}

check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    fi
    return 1  # Port is free
}

# ============================================================================
# MAIN SCRIPT
# ============================================================================

print_header "TOP FINANCE - COMPLETE STARTUP"

# Step 1: Check dependencies
print_header "STEP 1: CHECKING DEPENDENCIES"

print_step "Checking Node.js..."
if ! check_command "node"; then
    print_error "Node.js 18+ is required. Please install it from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_step "Checking npm..."
check_command "npm" || exit 1

print_step "Checking Docker..."
check_command "docker" || print_warning "Docker not found - will use local PostgreSQL"

print_step "Checking Docker Compose..."
check_command "docker-compose" || print_warning "Docker Compose not found"

# Step 2: Check and create .env files
print_header "STEP 2: CONFIGURING ENVIRONMENT"

# Create root .env for Docker Compose
ROOT_ENV_FILE="$PROJECT_ROOT/.env"
ROOT_ENV_EXAMPLE="$PROJECT_ROOT/.env.example"

if [ ! -f "$ROOT_ENV_FILE" ]; then
    if [ -f "$ROOT_ENV_EXAMPLE" ]; then
        print_step "Creating root .env for Docker..."
        cp "$ROOT_ENV_EXAMPLE" "$ROOT_ENV_FILE"
        print_success "Root .env created for Docker Compose"
    fi
else
    print_success "Root .env already exists"
fi

# Create backend project .env files
for project in "${BACKEND_PROJECTS[@]}"; do
    ENV_FILE="$PROJECT_ROOT/$project/.env"
    ENV_EXAMPLE="$PROJECT_ROOT/$project/.env.example"

    if [ ! -f "$ENV_FILE" ]; then
        if [ -f "$ENV_EXAMPLE" ]; then
            print_step "Creating .env for $project..."
            cp "$ENV_EXAMPLE" "$ENV_FILE"
            print_success ".env created for $project"
        fi
    else
        print_success ".env already exists for $project"
    fi
done

# Step 3: Install dependencies
print_header "STEP 3: INSTALLING DEPENDENCIES"

for project in "${PROJECTS[@]}"; do
    PROJECT_PATH="$PROJECT_ROOT/$project"
    if [ -f "$PROJECT_PATH/package.json" ]; then
        print_step "Installing dependencies for $project..."
        cd "$PROJECT_PATH"
        npm install --legacy-peer-deps > /tmp/npm-install-$project.log 2>&1
        print_success "Dependencies installed for $project"
    fi
done

# Step 4: Setup database
print_header "STEP 4: SETTING UP DATABASE"

print_step "Starting PostgreSQL containers..."
cd "$PROJECT_ROOT"

# Remove only old postgres containers to avoid password conflicts
print_step "Cleaning up old PostgreSQL containers..."
docker stop postgres-users postgres-finance 2>/dev/null || true
docker rm postgres-users postgres-finance 2>/dev/null || true
sleep 2

# Start fresh containers
print_step "Starting new PostgreSQL containers..."
docker-compose up -d postgres-users postgres-finance 2>/dev/null || print_warning "Could not start Docker containers"
print_step "Waiting for containers to initialize..."
sleep 10

# Wait for databases to be ready with retry logic (infinite retry)
print_step "Waiting for databases to be ready..."
wait_for_db() {
    local host=$1
    local port=$2
    local db=$3
    local attempt=0

    while true; do
        # Try multiple methods to check if port is open
        if nc -z "$host" "$port" >/dev/null 2>&1 || timeout 1 bash -c "echo >/dev/tcp/$host/$port" >/dev/null 2>&1; then
            print_success "Database $db port $port is ready"
            return 0
        fi
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done
}

# Wait for both databases (will wait indefinitely until they're ready)
wait_for_db "localhost" "5432" "users_db"
wait_for_db "localhost" "5433" "finance_db"

sleep 2

# Run migrations and seeds (skip if they fail - tables will be created on first service run)
print_header "STEP 4B: RUNNING MIGRATIONS AND SEEDS"
cd "$PROJECT_ROOT"

for project in "top-users" "top-finance"; do
    PROJECT_PATH="$PROJECT_ROOT/$project"
    print_step "Running migrations for $project..."
    cd "$PROJECT_PATH"
    npm run migrate:latest > /tmp/migrate-$project.log 2>&1 || print_warning "Migrations skipped for $project (will be created on first run)"

    print_step "Running seeds for $project..."
    npm run seed:run > /tmp/seed-$project.log 2>&1 || print_warning "Seeds skipped for $project (will be created on first run)"
done

print_success "Database setup completed (or will be created on first service run)"

# Step 5: Compile backend projects
print_header "STEP 5: COMPILING BACKEND PROJECTS"

for project in "${BACKEND_PROJECTS[@]}"; do
    PROJECT_PATH="$PROJECT_ROOT/$project"
    print_step "Compiling $project..."
    cd "$PROJECT_PATH"

    # Clean dist folder before building
    rm -rf dist

    # Run build and capture output
    if npm run build > /tmp/build-$project.log 2>&1; then
        # Wait a moment for files to be written
        sleep 1

        # Verify that dist/main.js was actually created
        if [ -f "dist/main.js" ]; then
            print_success "$project compiled"
        else
            print_error "Build succeeded but dist/main.js was not created for $project"
            echo "Build log:"
            cat /tmp/build-$project.log
            echo ""
            echo "Checking if src/main.ts exists:"
            ls -la src/main.ts 2>/dev/null || echo "❌ src/main.ts not found"
            echo ""
            echo "Checking dist folder:"
            ls -la dist/ 2>/dev/null || echo "❌ dist folder not found"
            exit 1
        fi
    else
        print_error "Build failed for $project"
        echo "Build log:"
        cat /tmp/build-$project.log
        exit 1
    fi
done

# Step 6: Build frontend remotes
print_header "STEP 6: BUILDING FRONTEND REMOTES"

for project in "top-frontend-users" "top-frontend-finance"; do
    PROJECT_PATH="$PROJECT_ROOT/$project"
    print_step "Building $project..."
    cd "$PROJECT_PATH"
    if npm run build > /tmp/build-$project.log 2>&1; then
        print_success "$project built"
    else
        print_error "Build failed for $project"
        echo "Build log:"
        cat /tmp/build-$project.log
        exit 1
    fi
done

# Step 7: Check ports
print_header "STEP 7: CHECKING PORTS (OPTIONAL)"

PORTS=(3000 3001 3002 5173 5174 5175 5432 5433)
for port in "${PORTS[@]}"; do
    if check_port "$port"; then
        print_warning "Port $port is already in use"
    else
        print_success "Port $port is available"
    fi
done

# Step 8: Start services
print_header "STEP 8: STARTING ALL SERVICES"

# Kill any existing processes
print_step "Cleaning up existing processes..."
pkill -f "node.*dist/main.js" || true
pkill -f "npm run dev" || true
pkill -f "vite preview" || true
sleep 2

# Start backend services
start_backend_service() {
    local service=$1
    local port=$2
    local log_file=$3

    print_step "Starting $service (port $port)..."
    cd "$PROJECT_ROOT/$service"

    if [ ! -f "dist/main.js" ]; then
        print_error "dist/main.js not found for $service"
        print_error "Build output:"
        cat /tmp/build-$service.log 2>/dev/null || echo "No build log found"
        exit 1
    fi

    node dist/main.js > "$log_file" 2>&1 &
    local pid=$!
    sleep 2

    # Check if process is still running
    if ! kill -0 $pid 2>/dev/null; then
        print_error "$service failed to start. Check logs:"
        cat "$log_file"
        exit 1
    fi

    print_success "$service started (PID: $pid)"
    echo $pid
}

TOP_USERS_PID=$(start_backend_service "top-users" "3001" "/tmp/top-users.log")
TOP_FINANCE_PID=$(start_backend_service "top-finance" "3002" "/tmp/top-finance.log")
API_GATEWAY_PID=$(start_backend_service "api-gateway" "3000" "/tmp/api-gateway.log")

# Start frontend services (remotes with serve_cors.py for Module Federation with CORS)
print_step "Building top-frontend-users..."
cd "$PROJECT_ROOT/top-frontend-users"
if npm run build > /tmp/build-users.log 2>&1; then
    print_success "top-frontend-users built"
else
    print_error "Build failed for top-frontend-users"
    echo "Build log:"
    cat /tmp/build-users.log
    exit 1
fi

print_step "Starting top-frontend-users (port 5174)..."
if [ ! -d "dist" ]; then
    print_error "dist directory not found for top-frontend-users. Build may have failed."
    exit 1
fi
python3 "$PROJECT_ROOT/serve_cors.py" 5174 "$PROJECT_ROOT/top-frontend-users/dist" > /tmp/vite-users.log 2>&1 &
USERS_PID=$!
sleep 2
print_success "top-frontend-users started (PID: $USERS_PID)"

print_step "Building top-frontend-finance..."
cd "$PROJECT_ROOT/top-frontend-finance"
if npm run build > /tmp/build-finance.log 2>&1; then
    print_success "top-frontend-finance built"
else
    print_error "Build failed for top-frontend-finance"
    echo "Build log:"
    cat /tmp/build-finance.log
    exit 1
fi

print_step "Starting top-frontend-finance (port 5175)..."
if [ ! -d "dist" ]; then
    print_error "dist directory not found for top-frontend-finance. Build may have failed."
    exit 1
fi
python3 "$PROJECT_ROOT/serve_cors.py" 5175 "$PROJECT_ROOT/top-frontend-finance/dist" > /tmp/vite-finance.log 2>&1 &
FINANCE_PID=$!
sleep 2
print_success "top-frontend-finance started (PID: $FINANCE_PID)"

print_step "Starting top-frontend (port 5173)..."
cd "$PROJECT_ROOT/top-frontend"
npm run dev > /tmp/vite-host.log 2>&1 &
HOST_PID=$!
sleep 3
print_success "top-frontend started (PID: $HOST_PID)"

# Step 9: Display summary
print_header "✅ ALL SERVICES STARTED SUCCESSFULLY"

echo -e "${GREEN}🎉 Top Finance is now running!${NC}"
echo ""
echo "📍 Access the application:"
echo -e "   ${BLUE}http://localhost:5173${NC}"
echo ""
echo "🔐 Test Credentials:"
echo -e "   Email:    ${BLUE}joao.silva@example.com${NC}"
echo -e "   Password: ${BLUE}Test@1234${NC}"
echo ""
echo "📊 Backend Services:"
echo "   top-users:        http://localhost:3001"
echo "   top-finance:      http://localhost:3002"
echo "   api-gateway:      http://localhost:3000"
echo ""
echo "🎨 Frontend Services:"
echo "   top-frontend:           http://localhost:5173"
echo "   top-frontend-users:     http://localhost:5174"
echo "   top-frontend-finance:   http://localhost:5175"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/top-users.log /tmp/top-finance.log /tmp/api-gateway.log"
echo "   Frontend: tail -f /tmp/vite-*.log"
echo ""
echo "🛑 To stop all services, run:"
echo -e "   ${YELLOW}pkill -f 'node dist/main.js|npm run dev|vite preview'${NC}"
echo ""
echo "🐳 To stop Docker containers, run:"
echo -e "   ${YELLOW}docker-compose down${NC}"
echo ""
echo "🧪 To run tests, execute:"
echo -e "   ${YELLOW}./manage-project.sh${NC} (choose option 10)"
echo ""

# Keep script running
wait

