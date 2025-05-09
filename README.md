# 📦 Tasks App - Backend e Frontend

Projeto que todo mundo já fez mas serve para consolidar conhecimentos: API RESTful de Gerenciamento de Tarefas com Autenticação via Token usando Laravel Sanctum e Frontend em ReactJS.

---

## 🧭 Visão Geral Funcional

Uma aplicação full-stack para **gerenciamento de tarefas com autenticação JWT**, ideal para aprendizado e prática de integração frontend-backend.

### Principais funcionalidades:

- Cadastro, login e logout de usuários
- Login como visitante sem necessidade de registro
- Redefinição de senha via e-mail
- Listagem, criação, edição, conclusão e exclusão de tarefas
- Integração via JWT e Context API
- Testes automatizados no backend (PHPUnit) e frontend (Vitest)
- CI com GitHub Actions para garantir qualidade de código

---

## 🗂 Estrutura do Projeto

```plaintext
├── frontend/   # Interface React + Vite
├── backend/    # API Laravel 12
├── .github/
│   └── workflows/
│       ├── backend-test.yml  # Testes automatizados do backend (CI)
│       └── frontend-test.yml # Testes automatizados do frontend (CI)
├── README.md   # Este arquivo
```

---

## 🧹 Frontend - Tasks App (React + Vite)

Aplicação React com Context API, TailwindCSS, React Router e testes automatizados com Vitest.

### Funcionalidades:

- Login, registro e redefinição de senha
- Login como visitante (sem cadastro)
- Listagem, criação, edição e exclusão de tarefas
- Proteção de rotas com Context API e JWT
- UI moderna e responsiva

### Requisitos:

- Node.js 20+
- NPM 9+ ou Yarn

### Instalação:

```bash
cd frontend
npm install
npm run dev
```

> Executa o app em `http://localhost:5173`

---

## 🛠 Backend - Tasks API (Laravel 12)

API RESTful com autenticação via Sanctum, suporte a UUID e testes automatizados.

### Funcionalidades:

- Registro, login, logout e login como visitante
- Redefinição de senha via e-mail
- CRUD completo de tarefas com UUID
- Respostas padronizadas em JSON
- Testes com PHPUnit

### Requisitos:

- PHP 8.2+
- Composer 2+
- MySQL 8

### Instalação:

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

> Configure o banco de dados corretamente no `.env`

---

## 🔁 Integração CI/CD com GitHub Actions

Este projeto possui dois workflows configurados para garantir qualidade de código contínua:

### 🔧 `backend-test.yml`

Executa os testes automatizados do Laravel em ambiente com MySQL:

- Roda em pushes e PRs para a branch `dev`
- Instala dependências via Composer
- Prepara `.env` e roda `migrate`
- Executa `php artisan test`

### 🧪 `frontend-test.yml`

Executa os testes do React com Vitest:

- Roda em pushes e PRs para a branch `dev`
- Instala dependências via `npm ci`
- Roda testes com `npx vitest run --environment jsdom`

---

## 🔗 Comunicação entre Frontend e Backend

- As rotas da API são consumidas no React via `fetch` com JWT armazenado no contexto.
- A variável `VITE_API_URL` no frontend define o endereço da API.

### Exemplo de chamada:

```js
await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

## ✅ Testes Automatizados

### Frontend:

- Vitest + Testing Library (`npm run test`)
- Testes de login, registro, tarefas, modais e formulários

### Backend:

- PHPUnit (`php artisan test`)
- Testes de Auth, Reset, Guest e Tarefas

---

## 📋 Considerações Finais

- O projeto segue boas práticas de código, validação e organização
- APIs retornam erros e validações de forma clara e consistente
- Ideal para uso como template de autenticação + tarefas com frontend e backend desacoplados

---

Para dúvidas ou sugestões, abra uma *issue* neste repositório.
