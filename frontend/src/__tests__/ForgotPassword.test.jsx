import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from '../pages/ForgotPassword';
import * as authApi from '../api/httpClient';
import { vi } from 'vitest';

vi.mock('../api/httpClient');

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('exibe o campo de email', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument();
  });

  test('envia o formulário com sucesso', async () => {
    authApi.apiFetch.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Digite seu email'), {
      target: { value: 'user@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /enviar link de recuperação/i }));

    expect(
      await screen.findByText(/link de recuperação enviado para seu email/i)
    ).toBeInTheDocument();

    expect(authApi.apiFetch).toHaveBeenCalledWith(
      '/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' }),
      },
      false
    );
  });

  test('exibe erro se a requisição falhar', async () => {
    authApi.apiFetch.mockRejectedValueOnce({
      data: { message: 'Erro no envio' },
    });

    render(
      <MemoryRouter>    
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Digite seu email'), {
      target: { value: 'user@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /enviar link de recuperação/i }));

    expect(await screen.findByText(/erro no envio/i)).toBeInTheDocument();
  });
});
