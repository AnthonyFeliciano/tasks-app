# Frontend - Tasks App (React + Vite)

Este diretório contém a interface de usuário da aplicação **Tasks**, desenvolvida com React 19, Vite, Tailwind CSS e React Router DOM. A aplicação permite aos usuários gerenciar tarefas, realizar autenticação segura, redefinir senhas e acessar como visitante, tudo de forma responsiva e moderna.

---

## ✅ Funcionalidades

* Tela de login, registro, esqueci minha senha e redefinição de senha
* Login como visitante (cria usuário anônimo)
* Listagem, criação, edição e exclusão de tarefas
* Marcar tarefa como concluída
* Feedback visual com loaders, validações e mensagens de erro
* Integração completa com a API do backend via JWT
* Layout responsivo com Tailwind CSS
* Gerenciamento de autenticação com Context API
* Proteção de rotas com componentes personalizados

---

## ⚙️ Requisitos do Ambiente

* Node.js 20 ou superior
* NPM 9+ ou Yarn

---

## 📦 Dependências

### Produção

* **react** `^19.0.0`
* **react-dom** `^19.0.0`
* **react-router-dom** `^7.5.3`
* **lucide-react** `^0.503.0`

### Desenvolvimento

* **vite** `^4.5.0`
* **@vitejs/plugin-react** `^4.3.4`
* **tailwindcss** `^3.4.17`
* **postcss** `^8.5.3`
* **autoprefixer** `^10.4.21`
* **eslint**, **eslint-plugin-react-hooks**, **eslint-plugin-react-refresh**
* **vitest**, **@testing-library/react**, **@testing-library/jest-dom**
* **jsdom**, **@types/react**, **@types/react-dom**

---

## 🚀 Instalação e Execução

```bash
cd frontend
npm install
npm run dev
```

> O app será iniciado por padrão em `http://localhost:5173`.

---

## 📁 Estrutura de Pastas

| Diretório     | Função                                                                |
| ------------- | --------------------------------------------------------------------- |
| `api/`        | Funções para consumo da API (ex: login, register, tasks)              |
| `auth/`       | Contexto global de autenticação e hook personalizado (`useAuth`)      |
| `components/` | Componentes reutilizáveis como Navbar, TaskModal, Button, Footer etc. |
| `pages/`      | Telas principais como Login, Register, TaskList, ResetPassword        |
| `routes/`     | Gerenciamento de rotas públicas e protegidas                          |
| `__tests__/`  | Testes automatizados com Vitest e Testing Library                     |

---

## 🔐 Autenticação e Proteção de Rotas

* Uso de **Context API** para armazenar e fornecer o token JWT globalmente
* Rotas protegidas com o componente `<ProtectedRoute />`
* Rotas públicas com restrição para usuários autenticados via `<GuestRoute />`
* Redirecionamento automático baseado na autenticação

---

## 🌐 Definição de Rotas

```jsx
<Routes>
  <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
  <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
  <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
  <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
  <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 🔄 Integração com Backend

As requisições são feitas via `fetch`, com headers de autenticação configurados automaticamente.

Exemplo:

```js
await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

> A URL da API deve ser definida no `.env` via `VITE_API_URL`

---

## 🦪 Testes Automatizados

### Ferramentas

* **Vitest**
* **@testing-library/react**
* **jsdom**

### Comando para executar:

```bash
npm run test
```

### Cobertura

* Fluxo de login e registro
* Redefinição de senha
* Listagem e manipulação de tarefas
* Comportamento de componentes (modais, botões, formulários)

---

## 💡 Observações

* A comunicação com o backend espera respostas em **JSON padronizado**
* O layout é responsivo e acessível, utilizando Tailwind CSS
* O projeto segue boas práticas de organização, segurança e testes