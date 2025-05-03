import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../pages/Register';
import { AuthContext } from '../auth/AuthContext';
import { vi } from 'vitest';
import { act } from 'react';

describe('Register Page', () => {
  const mockRegister = vi.fn();

  const renderRegister = () => {
    render(
      <AuthContext.Provider value={{ register: mockRegister, isAuthenticated: false, loading: false }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test('renderiza campos do formulário', () => {
    renderRegister();
    expect(screen.getByPlaceholderText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha (mínimo 8 caracteres)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirme a senha/i)).toBeInTheDocument();
  });

  test('exibe erro se a senha for muito curta', async () => {
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/nome completo/i), {
      target: { value: 'Usuário Teste' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha (mínimo 8 caracteres)'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirme a senha/i), {
      target: { value: '123' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    });

    expect(await screen.findByText(/a senha deve ter no mínimo 8 caracteres/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test('exibe erro se a confirmação da senha for diferente', async () => {
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/nome completo/i), {
      target: { value: 'Usuário Teste' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha (mínimo 8 caracteres)'), {
      target: { value: '12345678' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirme a senha/i), {
      target: { value: 'diferente' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    });

    expect(await screen.findByText(/a confirmação da senha não confere/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test('chama register com dados válidos', async () => {
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText(/nome completo/i), {
      target: { value: 'Usuário Teste' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha (mínimo 8 caracteres)'), {
      target: { value: '12345678' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirme a senha/i), {
      target: { value: '12345678' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    });

    expect(mockRegister).toHaveBeenCalledWith(
      'Usuário Teste',
      'teste@email.com',
      '12345678',
      '12345678'
    );
  });
});
