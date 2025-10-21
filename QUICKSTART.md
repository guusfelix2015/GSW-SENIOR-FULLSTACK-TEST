# QUICKSTART - Setup Manual do Top Finance

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

Verificar instalação:
```bash
node -v
npm -v
docker -v
docker-compose -v
```

---

## 1. Clonar e Preparar

```bash
git clone <seu-repositorio>
cd GSW-SENIOR-FULLSTACK-TEST
```

---

## 2. Configurar Variáveis de Ambiente

Copiar arquivos .env para cada projeto backend:

```bash
cp top-users/.env.example top-users/.env
cp top-finance/.env.example top-finance/.env
cp api-gateway/.env.example api-gateway/.env
```

---

## 3. Iniciar Banco de Dados

```bash
docker-compose up -d postgres-users postgres-finance
```

Aguardar 10-15 segundos para os containers ficarem prontos.

Verificar status:
```bash
docker ps | grep postgres
```

---

## 4. Instalar Dependências

```bash
npm install --legacy-peer-deps -w top-users
npm install --legacy-peer-deps -w top-finance
npm install --legacy-peer-deps -w api-gateway
npm install --legacy-peer-deps -w top-frontend
npm install --legacy-peer-deps -w top-frontend-users
npm install --legacy-peer-deps -w top-frontend-finance
```

---

## 5. Executar Migrations e Seeds

```bash
cd top-users
npm run migrate:latest
npm run seed:run
cd ..

cd top-finance
npm run migrate:latest
npm run seed:run
cd ..
```

---

## 6. Compilar Backends

```bash
cd top-users
npm run build
cd ..

cd top-finance
npm run build
cd ..

cd api-gateway
npm run build
cd ..
```

Verificar se `dist/main.js` foi criado em cada projeto.

---

## 7. Iniciar Serviços Backend

Abrir 3 terminais diferentes:

**Terminal 1 - top-users:**
```bash
cd top-users
node dist/main.js
```
Esperado: `✅ HTTP Server is running on http://localhost:3001`

**Terminal 2 - top-finance:**
```bash
cd top-finance
node dist/main.js
```
Esperado: `✅ HTTP Server is running on http://localhost:3002`

**Terminal 3 - api-gateway:**
```bash
cd api-gateway
node dist/main.js
```
Esperado: `🚀 API Gateway is running on http://localhost:3000`

---

## 8. Compilar Frontend Remotes

```bash
cd top-frontend-users
npm run build
cd ..

cd top-frontend-finance
npm run build
cd ..
```

---

## 9. Iniciar Frontend

Abrir novo terminal:

```bash
cd top-frontend
npm run dev
```

Esperado: `VITE v... ready in ... ms`

Acessar: **http://localhost:5173**

---

## 10. Login

Credenciais de teste:
- **Email:** `joao.silva@example.com`
- **Senha:** `Test@1234`

---

## Verificação Rápida

Todos os serviços rodando:
- API Gateway: http://localhost:3000/api/users
- Frontend: http://localhost:5173
- Top Users: http://localhost:3001
- Top Finance: http://localhost:3002

---

## Parar Tudo

```bash
# Parar containers Docker
docker-compose down

# Matar processos Node (Mac/Linux)
pkill -f "node dist/main.js"
pkill -f "npm run dev"

# Matar processos Node (Windows)
taskkill /F /IM node.exe
```

---

## Troubleshooting

**Banco não conecta:**
- Aguardar mais tempo (até 30s)
- Verificar: `docker logs postgres-users`

**Build falha:**
- Limpar: `rm -rf top-users/dist top-finance/dist api-gateway/dist`
- Tentar novamente: `npm run build`

**Porta em uso:**
- Verificar: `lsof -i :3000` (Mac/Linux)
- Matar processo: `kill -9 <PID>`

