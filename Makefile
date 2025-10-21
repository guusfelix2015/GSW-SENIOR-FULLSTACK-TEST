.PHONY: help build up down logs clean test migrate seed

# ============================================================================
# HELP
# ============================================================================

help:
	@echo "╔════════════════════════════════════════════════════════════════╗"
	@echo "║         Desafio Técnico - Microserviços e Microfrontends      ║"
	@echo "╚════════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "Comandos disponíveis:"
	@echo ""
	@echo "  make build              - Construir imagens Docker"
	@echo "  make up                 - Iniciar todos os serviços"
	@echo "  make down               - Parar todos os serviços"
	@echo "  make logs               - Ver logs em tempo real"
	@echo "  make logs-users         - Ver logs do serviço users"
	@echo "  make logs-finance       - Ver logs do serviço finance"
	@echo "  make logs-gateway       - Ver logs do API Gateway"
	@echo "  make ps                 - Listar containers em execução"
	@echo "  make clean              - Parar e remover volumes"
	@echo "  make test               - Executar testes"
	@echo "  make test-cov           - Testes com cobertura"
	@echo "  make migrate            - Executar migrações"
	@echo "  make seed               - Popular banco com dados de teste"
	@echo "  make shell-users        - Acessar shell do container users"
	@echo "  make shell-finance      - Acessar shell do container finance"
	@echo "  make shell-gateway      - Acessar shell do container gateway"
	@echo "  make db-users           - Conectar ao banco de usuários"
	@echo "  make db-finance         - Conectar ao banco de finanças"
	@echo "  make health             - Verificar saúde dos serviços"
	@echo "  make restart            - Reiniciar todos os serviços"
	@echo "  make rebuild            - Reconstruir e reiniciar"
	@echo ""

# ============================================================================
# DOCKER COMPOSE COMMANDS
# ============================================================================

build:
	@echo "🔨 Construindo imagens Docker..."
	docker-compose build

up:
	@echo "🚀 Iniciando serviços..."
	docker-compose up -d
	@echo "✅ Serviços iniciados!"
	@echo ""
	@echo "Acesse:"
	@echo "  Frontend Principal: http://localhost:5173"
	@echo "  Microfrontend Users: http://localhost:5174"
	@echo "  Microfrontend Finance: http://localhost:5175"
	@echo "  API Gateway: http://localhost:3000"

down:
	@echo "🛑 Parando serviços..."
	docker-compose down

logs:
	@echo "📋 Exibindo logs em tempo real..."
	docker-compose logs -f

logs-users:
	docker-compose logs -f top-users

logs-finance:
	docker-compose logs -f top-finance

logs-gateway:
	docker-compose logs -f api-gateway

ps:
	@echo "📊 Containers em execução:"
	docker-compose ps

clean:
	@echo "🧹 Limpando volumes e containers..."
	docker-compose down -v
	@echo "✅ Limpeza concluída!"

# ============================================================================
# TESTING COMMANDS
# ============================================================================

test:
	@echo "🧪 Executando testes..."
	docker-compose exec top-users npm run test
	docker-compose exec top-finance npm run test

test-cov:
	@echo "📊 Executando testes com cobertura..."
	docker-compose exec top-users npm run test:cov
	docker-compose exec top-finance npm run test:cov

test-e2e:
	@echo "🔄 Executando testes E2E..."
	docker-compose exec top-users npm run test:e2e
	docker-compose exec top-finance npm run test:e2e

# ============================================================================
# DATABASE COMMANDS
# ============================================================================

migrate:
	@echo "🔄 Executando migrações..."
	docker-compose exec top-users npm run migrate:latest
	docker-compose exec top-finance npm run migrate:latest
	@echo "✅ Migrações concluídas!"

migrate-rollback:
	@echo "⏮️  Revertendo migrações..."
	docker-compose exec top-users npm run migrate:rollback
	docker-compose exec top-finance npm run migrate:rollback

seed:
	@echo "🌱 Populando banco com dados de teste..."
	docker-compose exec top-users npm run seed:run
	docker-compose exec top-finance npm run seed:run
	@echo "✅ Seed concluído!"

db-users:
	@echo "🗄️  Conectando ao banco de usuários..."
	psql -h localhost -p 5432 -U postgres -d users_db

db-finance:
	@echo "🗄️  Conectando ao banco de finanças..."
	psql -h localhost -p 5433 -U postgres -d finance_db

# ============================================================================
# SHELL COMMANDS
# ============================================================================

shell-users:
	@echo "🐚 Acessando shell do container users..."
	docker-compose exec top-users bash

shell-finance:
	@echo "🐚 Acessando shell do container finance..."
	docker-compose exec top-finance bash

shell-gateway:
	@echo "🐚 Acessando shell do container gateway..."
	docker-compose exec api-gateway bash

# ============================================================================
# HEALTH CHECK
# ============================================================================

health:
	@echo "🏥 Verificando saúde dos serviços..."
	@echo ""
	@echo "API Gateway:"
	@curl -s http://localhost:3000/health || echo "❌ Indisponível"
	@echo ""
	@echo "Users Service:"
	@curl -s http://localhost:3001/health || echo "❌ Indisponível"
	@echo ""
	@echo "Finance Service:"
	@curl -s http://localhost:3002/health || echo "❌ Indisponível"
	@echo ""

# ============================================================================
# UTILITY COMMANDS
# ============================================================================

restart:
	@echo "🔄 Reiniciando serviços..."
	docker-compose restart
	@echo "✅ Serviços reiniciados!"

rebuild:
	@echo "🔨 Reconstruindo e reiniciando..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo "✅ Reconstrução concluída!"

install-deps:
	@echo "📦 Instalando dependências..."
	docker-compose exec top-users npm install
	docker-compose exec top-finance npm install
	docker-compose exec api-gateway npm install
	docker-compose exec frontend npm install
	docker-compose exec frontend-users npm install
	docker-compose exec frontend-finance npm install
	@echo "✅ Dependências instaladas!"

# ============================================================================
# DEFAULT
# ============================================================================

.DEFAULT_GOAL := help

