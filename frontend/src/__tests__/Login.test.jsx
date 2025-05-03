import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthContext } from '../auth/AuthContext';
import { vi } from 'vitest';
import { act } from 'react';

describe('Login Page', () => {
  const mockLogin = vi.fn();

  const renderLogin = (customContext = {}) => {
    render(
      <AuthContext.Provider
        value={{
          login: mockLogin,
          isAuthenticated: false,
          loading: false,
          ...customContext,
        }}
      >
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test('exibe campos de email e senha', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
  });

  test('chama login com dados válidos', async () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'user@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senha123' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    });

    expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'senha123');
  });

  test('mostra erro ao falhar login', async () => {
    const errorLogin = vi.fn().mockRejectedValue(new Error('Credenciais inválidas'));

    renderLogin({ login: errorLogin });

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'user@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senha123' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    });

    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });
});
