@component('mail::message')

# Olá!

Você solicitou a **redefinição de senha** da sua conta no **{{ config('app.name') }}**.

Clique no botão abaixo para criar uma nova senha segura:

{{-- Botão customizado --}}
<div style="text-align: center; margin: 30px 0;">
    <a href="{{ $resetLink }}" style="
        background-color: #6366F1;
        border: 1px solid #6366F1;
        border-radius: 6px;
        color: #ffffff;
        padding: 14px 28px;
        text-decoration: none;
        display: inline-block;
        font-weight: 600;
        font-size: 16px;
        font-family: 'Segoe UI', sans-serif;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
    ">
        Redefinir Senha
    </a>
</div>

<p style="color: #6B7280; font-size: 14px; text-align: center; margin-top: 30px;">
    Se você não solicitou isso, pode ignorar este e-mail. Nenhuma ação será tomada.
</p>

---

<p style="color: #6B7280; font-size: 14px; text-align: center;">
    Abraços,<br>
    Equipe {{ config('app.name') }}
</p>

{{-- Rodapé opcional --}}
<div style="text-align: center; margin-top: 40px; font-size: 12px; color: #9CA3AF;">
    <p>
        © {{ date('Y') }} {{ config('app.name') }} · Todos os direitos reservados
    </p>
    <p>
        <a href="{{ config('app.url') }}" style="color: #6366F1; text-decoration: underline;">Visite nosso site</a>
    </p>
</div>

@endcomponent
