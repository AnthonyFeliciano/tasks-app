# Backend - Tasks API (Laravel 12)

Este diretório contém o backend da aplicação Tasks, desenvolvido com Laravel 12. Ele fornece uma API RESTful segura para o gerenciamento de tarefas, autenticação de usuários e login como visitante, além de suporte para redefinição de senha via e-mail.

---

## ✅ Funcionalidades

* Registro, login e logout de usuários
* Redefinição de senha com envio de e-mail personalizado
* Login como visitante (sem necessidade de cadastro)
* CRUD completo de tarefas (criar, listar, editar, excluir, concluir)
* Autenticação via token JWT com Laravel Sanctum
* Uso de UUID como identificador único para usuários e tarefas
* Retorno de erros de formulário padronizados em JSON
* Retorno padronizado de erros HTTP como 404, 401, 405 e 500
* Separação de responsabilidades por controlador (Auth, Tasks, Reset, Guest)

---

## ⚙️ Requisitos do Ambiente

* PHP 8.2+
* Laravel 12
* Composer 2+
* MySQL 8

---

## 🚀 Instalação

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

> Certifique-se de configurar corretamente o banco de dados no arquivo `.env`.

---

## 🔧 Ajustes de Bootstrap e Exceções Globais

No arquivo `bootstrap/app.php`, foi removida a rota web padrão:

```php
web: __DIR__.'/../routes/web.php',
```

E adicionada a rota da API:

```php
api: __DIR__.'/../routes/api.php',
```

Além disso, foi incluído um bloco de exceções personalizadas para garantir que todos os erros HTTP sejam retornados em JSON:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Rota não encontrada.', 'status' => 404], 404);
        }
    });

    $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException $e, $request) {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Método não permitido.', 'status' => 405], 405);
        }
    });

    $exceptions->renderable(function (\Illuminate\Auth\AuthenticationException $e, $request) {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Não autenticado.', 'status' => 401], 401);
        }
    });

    $exceptions->renderable(function (\Throwable $e, $request) {
        if ($request->expectsJson() || $request->is('api/*')) {
            $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
            return response()->json(['message' => $e->getMessage() ?: 'Erro no servidor.', 'status' => $status], $status);
        }
    });
})
```

---

## 📌 Testes Automatizados

A API possui testes automatizados organizados por domínio, garantindo cobertura para as principais funcionalidades:

### 🧪 AuthTest

Local: `tests/Feature/AuthTest.php`

* ✅ `user_can_register`
* ✅ `user_can_login`
* ✅ `login_wrong_credentials_fails`
* ✅ `user_can_logout`

### 🔐 ForgotPasswordTest

Local: `tests/Feature/ForgotPasswordTest.php`

* ✅ `it_sends_a_reset_link_email`
* ✅ `it_resets_the_password_with_a_valid_token`
* ✅ `it_fails_to_reset_with_invalid_token`

### 👤 GuestLoginTest

Local: `tests/Feature/GuestLoginTest.php`

* ✅ `it_creates_a_guest_user_and_returns_a_token`
* ✅ `it_creates_unique_guest_emails`

### ✅ TaskTest

Local: `tests/Feature/TaskTest.php`

* ✅ `user_can_list_tasks`
* ✅ `user_can_create_task`
* ✅ `user_can_update_task`
* ✅ `user_can_delete_task`

Para executar os testes:

```bash
php artisan test
```

---

## 📝 Retorno de Erros de Formulário

A aplicação utiliza um controlador dedicado (`FormErrorController`) para retornar erros de validação com mensagens personalizadas em formato JSON.

### Exemplo de uso:

```php
$validator = Validator::make($request->all(), [...]);
if ($validator->fails()) {
    return FormErrorController::validation($validator);
}
```

### Implementação:

```php
public static function validation(Validator $validator)
{
    throw new HttpResponseException(response()->json([
        'status' => 'error',
        'message' => $validator->errors(),
    ], 422));
}
```

### Exemplo de resposta:

```json
{
  "status": "error",
  "message": {
    "email": ["Informe um e-mail válido."]
  }
}
```

---

## 🔑 Uso de UUID como ID

Ambos os modelos `User` e `Task` utilizam UUID como chave primária ao invés de IDs auto-incrementais.

### Exemplo - `User.php`

```php
public $incrementing = false;
protected $keyType = 'string';

protected static function boot()
{
    parent::boot();

    static::creating(function ($model) {
        if (empty($model->{$model->getKeyName()})) {
            $model->{$model->getKeyName()} = (string) \Illuminate\Support\Str::uuid();
        }
    });
}
```

### Exemplo - `Task.php`

```php
public $incrementing = false;
protected $keyType = 'string';

protected static function boot()
{
    parent::boot();

    static::creating(function ($model) {
        if (empty($model->{$model->getKeyName()})) {
            $model->{$model->getKeyName()} = (string) \Illuminate\Support\Str::uuid();
        }
    });
}
```

Isso garante unicidade global dos registros e facilita a manipulação de dados entre serviços distintos.

---

Para mais detalhes, consulte a documentação do Laravel 12 ou abra uma issue neste repositório.
