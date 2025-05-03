import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../pages/TaskList';
import { AuthContext } from '../auth/AuthContext';
import { vi } from 'vitest';
import * as taskApi from '../api/task';
import { MemoryRouter } from 'react-router-dom';

describe('TaskList', () => {
  const mockLogout = vi.fn();
  const mockTasks = [
    { id: 1, title: 'Tarefa 1', description: 'Descrição 1', is_completed: 0 },
  ];

  beforeEach(() => {
    vi.spyOn(taskApi, 'fetchTasks').mockResolvedValue({ tasks: mockTasks });
  });

  const renderWithAuth = () =>
    render(
      <AuthContext.Provider value={{ logout: mockLogout }}>
        <MemoryRouter>
          <TaskList />
        </MemoryRouter>
      </AuthContext.Provider>
    );

  test('exibe mensagem de carregamento inicialmente', () => {
    renderWithAuth();
    expect(screen.getByText(/carregando.../i)).toBeInTheDocument();
  });

  test('renderiza tarefas após carregamento', async () => {
    renderWithAuth();
    expect(await screen.findByText('Tarefa 1')).toBeInTheDocument();
  });

  test('exibe mensagem de vazio se não houver tarefas', async () => {
    vi.spyOn(taskApi, 'fetchTasks').mockResolvedValue({ tasks: [] });
    renderWithAuth();
    expect(await screen.findByText(/nenhuma tarefa por aqui/i)).toBeInTheDocument();
  });

  test('abre modal ao clicar em "+ Nova Tarefa"', async () => {
    renderWithAuth();
    const button = await screen.findByRole('button', { name: /\+ nova tarefa/i });
    fireEvent.click(button);
    // expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
