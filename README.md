# 🏦 Top Finance - Teste Técnico GSW

**Teste Técnico para a Empresa GSW**

Bem-vindo ao **Top Finance**, um projeto full-stack de microserviços desenvolvido como teste técnico para a empresa GSW. Este projeto demonstra competências em arquitetura de microserviços, desenvolvimento full-stack, autenticação, testes automatizados e DevOps.

Este guia consolida todas as informações necessárias para executar, testar e avaliar o projeto.

---

## 📑 Índice

1. [Início Rápido](#início-rápido)
2. [Arquitetura](#arquitetura)
3. [Testes](#testes)
4. [Funcionalidades para Testar](#funcionalidades-para-testar)
5. [Gerenciamento](#gerenciamento)
6. [Troubleshooting](#troubleshooting)
7. [Documentação Adicional](#documentação-adicional)

---

## ⚡ Início Rápido

**Teste Técnico para a Empresa GSW** - Demonstra competências em microserviços, full-stack, testes automatizados e DevOps.

### Execute em 1 Comando

```bash
./start-project.sh
```

O script automatiza: verificação de dependências, instalação de pacotes, configuração do banco, migrações, compilação e inicialização de todos os 6 serviços (3-5 minutos).

### Acessar a Aplicação

```
🌐 URL: http://localhost:5173
🔐 Email: joao@test.com
🔐 Senha: Test@1234
```

### Pré-requisitos

- Node.js 18+
- npm (incluído com Node.js)
- Docker Instalado

---

## 🏗️ Arquitetura

**Microserviços:** 3 serviços independentes (top-users, top-finance, api-gateway) com bancos isolados.
**API Gateway:** Centraliza requisições HTTP e comunica com microserviços via TCP.
**Microfrontends:** Module Federation permite componentes remotos carregados dinamicamente.
**DDD:** Domain-Driven Design para separação clara de responsabilidades.

### Serviços

| Serviço              | Tecnologia   | Porta | Descrição                |
| -------------------- | ------------ | ----- | ------------------------ |
| top-users            | NestJS + TS  | 5002  | Microserviço de usuários |
| top-finance          | NestJS + TS  | 5001  | Microserviço de finanças |
| api-gateway          | NestJS       | 3000  | Gateway de API           |
| top-frontend         | React + Vite | 5173  | Host (Module Federation) |
| top-frontend-users   | React + Vite | 5174  | Remote Users             |
| top-frontend-finance | React + Vite | 5175  | Remote Finance           |
| postgres-users       | PostgreSQL   | 5432  | Banco de usuários        |
| postgres-finance     | PostgreSQL   | 5433  | Banco de finanças        |

### Stack Tecnológico

**Backend:** NestJS, TypeScript, Knex.js, PostgreSQL, JWT, TCP
**Frontend:** React, Vite, Material-UI, TanStack Query, Zustand, Module Federation
**Testes:** Jest (unitários/integração), Supertest (E2E), ~88% cobertura
**DevOps:** Docker, Docker Compose, Scripts Bash

---

## 🚀 Scripts

**start-project.sh** - Inicialização completa (verifica dependências, instala pacotes, configura BD, compila e inicia todos os 6 serviços)

**manage-project.sh** - Menu interativo com 10 opções: iniciar/parar/reiniciar serviços, visualizar status/logs, resetar BD, limpar, instalar dependências, compilar, **executar testes** ⭐

---

## 📄 Arquivo Auxiliar

**serve_cors.py** - Servidor HTTP simples com CORS habilitado para servir arquivos estáticos durante desenvolvimento/testes.

**Por que existe:** Durante o desenvolvimento com Module Federation e microfrontends, é necessário servir arquivos estáticos com CORS habilitado para permitir que componentes remotos sejam carregados dinamicamente sem erros de cross-origin. Este script fornece uma solução leve e rápida para esse cenário.

---

## 🧪 Testes

**Total:** 107 testes | **Cobertura:** ~88% | **Status:** ✅ Todos passando

| Tipo       | Quantidade | Cobertura |
| ---------- | ---------- | --------- |
| Unitários  | 49         | ~85%      |
| Integração | 36         | ~88%      |
| E2E        | 22         | ~90%      |

### Executar Testes

```bash
./manage-project.sh
# Escolher opção 10 (Run tests)
```

Opções: Unit tests (49) | Integration tests (36) | E2E tests (22) | All tests (107) | Coverage report (~88%)

---

## ✅ Funcionalidades para Testar

**Autenticação:** Login (joao@test.com / Test@1234) | Registro | Logout | Proteção de rotas

**Usuários (CRUD):** Listar | Criar | Visualizar | Desativar | Deletar

**Finanças (CRUD):** Listar | Criar | Visualizar | Confirmar | Cancelar | Deletar

**Module Federation:** Componentes remotos carregam | Navegação funciona | Sem erros de CORS

---

## 🛠️ Gerenciamento

Use `./manage-project.sh` para: iniciar/parar/reiniciar serviços, visualizar status/logs, resetar BD, limpar tudo, instalar dependências, compilar.

**Comandos diretos:**

```bash
# Parar
pkill -f 'node dist/main.js|npm run dev|vite preview' && docker-compose down

# Reiniciar
pkill -f 'node dist/main.js|npm run dev|vite preview' && sleep 2 && ./start-project.sh

# Limpar tudo
pkill -f 'node dist/main.js|npm run dev|vite preview' && docker-compose down -v && rm -rf */dist */node_modules
```

---

## 🐛 Troubleshooting

| Problema                            | Solução                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| Porta já em uso                     | `lsof -i :5173` → `kill -9 <PID>`                                  |
| Docker não instalado                | PostgreSQL deve estar instalado localmente                         |
| npm install falha                   | `npm cache clean --force` → `./start-project.sh`                   |
| Banco não conecta                   | `docker ps` → `docker-compose restart`                             |
| Serviços não iniciam                | Verifique logs em `/tmp/` e portas livres                          |
| `Cannot find module 'dist/main.js'` | Compilação falhou. Verifique logs em `/tmp/build-*.log`            |
| Build falha silenciosamente         | Execute `npm run build` manualmente em cada projeto para ver erros |

---

## ✅ Checklist de Validação

- [ ] Script iniciou sem erros
- [ ] Todos os 6 serviços rodando
- [ ] Acesso a http://localhost:5173
- [ ] Login funcionando (joao@test.com / Test@1234)
- [ ] CRUD de usuários operacional
- [ ] CRUD de finanças operacional
- [ ] Logout funcionando
- [ ] Sem erros no console do navegador

---
