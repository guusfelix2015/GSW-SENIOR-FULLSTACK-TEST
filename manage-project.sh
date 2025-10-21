#!/bin/bash

################################################################################
#                                                                              #
#                    TOP FINANCE - PROJECT MANAGEMENT SCRIPT                  #
#                                                                              #
#  This script provides utilities to manage the Top Finance project:          #
#  - Start/stop services                                                      #
#  - View logs                                                                #
#  - Reset database                                                           #
#  - Check service status                                                     #
#                                                                              #
################################################################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ============================================================================
# FUNCTIONS
# ============================================================================

print_menu() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════════════════╗"
    echo "║                    TOP FINANCE - PROJECT MANAGEMENT                        ║"
    echo "╠════════════════════════════════════════════════════════════════════════════╣"
    echo "║                                                                            ║"
    echo "║  1. Start all services                                                     ║"
    echo "║  2. Stop all services                                                      ║"
    echo "║  3. Restart all services                                                   ║"
    echo "║  4. View service status                                                    ║"
    echo "║  5. View logs                                                              ║"
    echo "║  6. Reset database                                                         ║"
    echo "║  7. Clean up (remove containers & volumes)                                 ║"
    echo "║  8. Install dependencies                                                   ║"
    echo "║  9. Build all projects                                                     ║"
    echo "║  10. Run tests                                                             ║"
    echo "║  0. Exit                                                                   ║"
    echo "║                                                                            ║"
    echo "╚════════════════════════════════════════════════════════════════════════════╝"
    echo ""
}

print_info() {
    echo -e "${BLUE}$1${NC}"
}

print_success_msg() {
    echo -e "${GREEN}$1${NC}"
}

print_error_msg() {
    echo -e "${RED}$1${NC}"
}

print_warning_msg() {
    echo -e "${YELLOW}$1${NC}"
}

start_services() {
    print_info "Starting all services..."
    cd "$PROJECT_ROOT"
    ./start-project.sh
}

stop_services() {
    print_warning_msg "Stopping all services..."
    pkill -f 'node dist/main.js' || true
    pkill -f 'npm run dev' || true
    pkill -f 'vite preview' || true
    pkill -f 'serve_cors.py' || true
    pkill -f 'python3 serve_cors' || true
    pkill -f 'serve.*5174' || true
    pkill -f 'serve.*5175' || true
    sleep 2

    print_warning_msg "Stopping Docker containers..."
    cd "$PROJECT_ROOT"
    docker-compose down || true
    sleep 2

    print_success_msg "✅ All services stopped"
}

restart_services() {
    print_warning_msg "Restarting all services..."
    stop_services
    sleep 2
    start_services
}

view_status() {
    print_info "Checking service status..."
    echo ""

    # Check ports
    PORTS=(3000 3001 3002 5173 5174 5175)
    for port in "${PORTS[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_success_msg "✅ Port $port is in use"
        else
            print_error_msg "❌ Port $port is free"
        fi
    done

    echo ""
    print_info "Docker containers:"
    docker ps --filter "name=postgres\|top-" --format "table {{.Names}}\t{{.Status}}" 2>/dev/null || echo "Docker not available"

    echo ""
    print_info "Node processes:"
    ps aux | grep -E 'node|npm|vite' | grep -v grep || echo "No Node processes running"
}

view_logs() {
    echo ""
    echo "Which logs would you like to view?"
    echo "1. top-users"
    echo "2. top-finance"
    echo "3. api-gateway"
    echo "4. top-frontend (host)"
    echo "5. top-frontend-users"
    echo "6. top-frontend-finance"
    echo "7. All logs"
    echo "0. Back to menu"
    echo ""
    read -p "Enter your choice: " log_choice

    case $log_choice in
        1) tail -f /tmp/top-users.log ;;
        2) tail -f /tmp/top-finance.log ;;
        3) tail -f /tmp/api-gateway.log ;;
        4) tail -f /tmp/vite-host.log ;;
        5) tail -f /tmp/vite-users.log ;;
        6) tail -f /tmp/vite-finance.log ;;
        7) tail -f /tmp/top-users.log /tmp/top-finance.log /tmp/api-gateway.log /tmp/vite-*.log ;;
        0) return ;;
        *) print_error_msg "Invalid choice" ;;
    esac
}

reset_database() {
    print_warning_msg "⚠️  This will reset the database and delete all data!"
    read -p "Are you sure? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        echo "Cancelled"
        return
    fi

    print_warning_msg "Resetting database..."

    # Stop services
    stop_services

    # Remove Docker volumes
    echo "Removing Docker volumes..."
    docker-compose down -v 2>/dev/null || true

    # Start fresh
    echo "Starting fresh database..."
    docker-compose up -d postgres-users postgres-finance 2>/dev/null || true
    sleep 5

    # Run migrations and seeds
    for project in "top-users" "top-finance"; do
        echo "Migrating $project..."
        cd "$PROJECT_ROOT/$project"
        npm run migrate:latest > /tmp/migrate-$project.log 2>&1 || true
        npm run seed:run > /tmp/seed-$project.log 2>&1 || true
    done

    print_success_msg "✅ Database reset complete"
}

cleanup() {
    print_warning_msg "⚠️  This will remove all containers and volumes!"
    read -p "Are you sure? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        echo "Cancelled"
        return
    fi

    print_warning_msg "Cleaning up..."

    # Stop services
    stop_services

    # Remove Docker resources
    echo "Removing Docker containers and volumes..."
    docker-compose down -v 2>/dev/null || true

    # Clean node_modules and dist
    echo "Cleaning build artifacts..."
    for project in "top-users" "top-finance" "api-gateway" "top-frontend" "top-frontend-users" "top-frontend-finance"; do
        if [ -d "$PROJECT_ROOT/$project" ]; then
            rm -rf "$PROJECT_ROOT/$project/dist" 2>/dev/null || true
            rm -rf "$PROJECT_ROOT/$project/node_modules" 2>/dev/null || true
        fi
    done

    print_success_msg "✅ Cleanup complete"
}

install_deps() {
    print_info "Installing dependencies..."

    for project in "top-users" "top-finance" "api-gateway" "top-frontend" "top-frontend-users" "top-frontend-finance"; do
        if [ -f "$PROJECT_ROOT/$project/package.json" ]; then
            echo "Installing $project..."
            cd "$PROJECT_ROOT/$project"
            npm install --legacy-peer-deps > /tmp/npm-install-$project.log 2>&1
            print_success_msg "✅ $project"
        fi
    done

    print_success_msg "✅ All dependencies installed"
}

build_all() {
    print_info "Building all projects..."

    # Build backend
    for project in "top-users" "top-finance" "api-gateway"; do
        echo "Building $project..."
        cd "$PROJECT_ROOT/$project"
        npm run build > /tmp/build-$project.log 2>&1
        print_success_msg "✅ $project"
    done

    # Build frontend
    for project in "top-frontend-users" "top-frontend-finance"; do
        echo "Building $project..."
        cd "$PROJECT_ROOT/$project"
        npm run build > /tmp/build-$project.log 2>&1
        print_success_msg "✅ $project"
    done

    print_success_msg "✅ All projects built"
}

run_tests() {
    echo ""
    echo "🧪 Which tests would you like to run?"
    echo "1. Unit tests (top-users, top-finance)"
    echo "2. Integration tests (top-users, top-finance)"
    echo "3. E2E tests (api-gateway)"
    echo "4. All tests (unit + integration + E2E)"
    echo "5. Test coverage report"
    echo "0. Back to menu"
    echo ""
    read -p "Enter your choice: " test_choice

    case $test_choice in
        1)
            print_info "Running unit tests..."
            echo ""

            # top-users unit tests
            echo "📝 top-users unit tests..."
            cd "$PROJECT_ROOT/top-users"
            npm run test 2>&1 | tee /tmp/test-top-users.log

            # top-finance unit tests
            echo ""
            echo "📝 top-finance unit tests..."
            cd "$PROJECT_ROOT/top-finance"
            npm run test 2>&1 | tee /tmp/test-top-finance.log

            print_success_msg "✅ Unit tests completed"
            ;;
        2)
            print_info "Running integration tests..."
            echo ""

            # top-users integration tests
            echo "🔗 top-users integration tests..."
            cd "$PROJECT_ROOT/top-users"
            npm run test:integration 2>&1 | tee /tmp/test-integration-top-users.log

            # top-finance integration tests
            echo ""
            echo "🔗 top-finance integration tests..."
            cd "$PROJECT_ROOT/top-finance"
            npm run test:integration 2>&1 | tee /tmp/test-integration-top-finance.log

            print_success_msg "✅ Integration tests completed"
            ;;
        3)
            print_info "Running E2E tests..."
            echo ""

            # Check if services are running
            if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
                print_error_msg "❌ api-gateway is not running on port 3000"
                echo "Please start the services first (option 1)"
                return
            fi

            cd "$PROJECT_ROOT/api-gateway"
            npm run test:e2e 2>&1 | tee /tmp/test-e2e.log

            print_success_msg "✅ E2E tests completed"
            ;;
        4)
            print_info "Running all tests..."
            echo ""

            # Unit tests
            echo "📝 Unit tests..."
            cd "$PROJECT_ROOT/top-users"
            npm run test > /tmp/test-top-users.log 2>&1
            cd "$PROJECT_ROOT/top-finance"
            npm run test > /tmp/test-top-finance.log 2>&1

            # Integration tests
            echo "🔗 Integration tests..."
            cd "$PROJECT_ROOT/top-users"
            npm run test:integration > /tmp/test-integration-top-users.log 2>&1
            cd "$PROJECT_ROOT/top-finance"
            npm run test:integration > /tmp/test-integration-top-finance.log 2>&1

            # E2E tests
            if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
                echo "🌐 E2E tests..."
                cd "$PROJECT_ROOT/api-gateway"
                npm run test:e2e > /tmp/test-e2e.log 2>&1
            else
                print_warning_msg "⚠️  Skipping E2E tests (services not running)"
            fi

            # Display summary
            echo ""
            print_info "📊 Test Summary:"
            echo ""

            # Count tests from logs
            UNIT_USERS=$(grep -o "passed" /tmp/test-top-users.log 2>/dev/null | wc -l)
            UNIT_FINANCE=$(grep -o "passed" /tmp/test-top-finance.log 2>/dev/null | wc -l)
            INT_USERS=$(grep -o "passed" /tmp/test-integration-top-users.log 2>/dev/null | wc -l)
            INT_FINANCE=$(grep -o "passed" /tmp/test-integration-top-finance.log 2>/dev/null | wc -l)
            E2E=$(grep -o "passed" /tmp/test-e2e.log 2>/dev/null | wc -l)

            TOTAL=$((UNIT_USERS + UNIT_FINANCE + INT_USERS + INT_FINANCE + E2E))

            echo "Unit Tests:"
            echo "  top-users:    $UNIT_USERS tests"
            echo "  top-finance:  $UNIT_FINANCE tests"
            echo ""
            echo "Integration Tests:"
            echo "  top-users:    $INT_USERS tests"
            echo "  top-finance:  $INT_FINANCE tests"
            echo ""
            echo "E2E Tests:"
            echo "  api-gateway:  $E2E tests"
            echo ""
            print_success_msg "✅ Total: $TOTAL tests"
            ;;
        5)
            print_info "Generating test coverage reports..."
            echo ""

            # top-users coverage
            echo "📊 top-users coverage..."
            cd "$PROJECT_ROOT/top-users"
            npm run test:cov > /tmp/coverage-top-users.log 2>&1

            # top-finance coverage
            echo "📊 top-finance coverage..."
            cd "$PROJECT_ROOT/top-finance"
            npm run test:cov > /tmp/coverage-top-finance.log 2>&1

            # api-gateway coverage
            echo "📊 api-gateway E2E coverage..."
            cd "$PROJECT_ROOT/api-gateway"
            npm run test:e2e:cov > /tmp/coverage-api-gateway.log 2>&1

            print_success_msg "✅ Coverage reports generated"
            echo ""
            print_info "Coverage reports available at:"
            echo "  top-users:    $PROJECT_ROOT/top-users/coverage"
            echo "  top-finance:  $PROJECT_ROOT/top-finance/coverage"
            echo "  api-gateway:  $PROJECT_ROOT/api-gateway/coverage"
            ;;
        0)
            return
            ;;
        *)
            print_error_msg "Invalid choice"
            ;;
    esac
}

# ============================================================================
# MAIN LOOP
# ============================================================================

while true; do
    print_menu
    read -p "Enter your choice (0-10): " choice

    case $choice in
        1) start_services ;;
        2) stop_services ;;
        3) restart_services ;;
        4) view_status ;;
        5) view_logs ;;
        6) reset_database ;;
        7) cleanup ;;
        8) install_deps ;;
        9) build_all ;;
        10) run_tests ;;
        0)
            print_info "Goodbye!"
            exit 0
            ;;
        *)
            print_error_msg "Invalid choice. Please try again."
            ;;
    esac
done

