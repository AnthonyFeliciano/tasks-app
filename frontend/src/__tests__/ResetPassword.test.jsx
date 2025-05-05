import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPassword from '../pages/ResetPassword';
import * as authApi from '../api/auth';
import { vi } from 'vitest';

vi.mock('../api/auth');

const renderWithToken = (token = 'validtoken') => {
  render(
    <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ResetPassword Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('exibe os campos corretamente', () => {
    renderWithToken();
    expect(screen.getByPlaceholderText('Nova senha (mínimo 8 caracteres)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirme a nova senha')).toBeInTheDocument();
  });

  test('exibe erro se senhas não coincidem', async () => {
    renderWithToken();

    fireEvent.change(screen.getByPlaceholderText('Nova senha (mínimo 8 caracteres)'), {
      target: { value: '12345678' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirme a nova senha'), {
      target: { value: 'diferente' },
    });

    fireEvent.click(screen.getByRole('button', { name: /redefinir senha/i }));

    expect(await screen.findByText(/as senhas não coincidem/i)).toBeInTheDocument();
  });

  test('envia formulário com sucesso', async () => {
    authApi.resetPassword.mockResolvedValueOnce({});

    renderWithToken('validtoken');

    fireEvent.change(screen.getByPlaceholderText('Nova senha (mínimo 8 caracteres)'), {
      target: { value: '12345678' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirme a nova senha'), {
      target: { value: '12345678' },
    });

    fireEvent.click(screen.getByRole('button', { name: /redefinir senha/i }));

    expect(await screen.findByText(/senha redefinida com sucesso/i)).toBeInTheDocument();
    expect(authApi.resetPassword).toHaveBeenCalledWith({
      password: '12345678',
      password_confirmation: '12345678',
      token: 'validtoken',
    });
  });

  test('exibe erro ao enviar com token inválido', async () => {
    authApi.resetPassword.mockRejectedValueOnce({
      data: { message: 'Token inválido' },
    });

    renderWithToken('invalidtoken');

    fireEvent.change(screen.getByPlaceholderText('Nova senha (mínimo 8 caracteres)'), {
      target: { value: '12345678' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirme a nova senha'), {
      target: { value: '12345678' },
    });

    fireEvent.click(screen.getByRole('button', { name: /redefinir senha/i }));

    expect(await screen.findByText(/token inválido/i)).toBeInTheDocument();
  });
});
