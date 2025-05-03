import { render, screen, fireEvent } from '@testing-library/react';
import Task from '../components/Task';
import { vi } from 'vitest';
import { act } from 'react';

describe('Task Component', () => {
  const mockTask = {
    id: 1,
    title: 'Tarefa de Teste',
    description: 'Descrição da tarefa',
    is_completed: 0,
  };

  test('renderiza título e descrição da tarefa', () => {
    render(
      <Task
        task={mockTask}
        onEdit={() => {}}
        onDelete={() => {}}
        onToggleComplete={() => {}}
        loading={false}
      />
    );
    expect(screen.getByText('Tarefa de Teste')).toBeInTheDocument();
    expect(screen.getByText('Descrição da tarefa')).toBeInTheDocument();
  });

  test('aplica estilo line-through se tarefa estiver concluída', () => {
    render(
      <Task
        task={{ ...mockTask, is_completed: 1 }}
        onEdit={() => {}}
        onDelete={() => {}}
        onToggleComplete={() => {}}
        loading={false}
      />
    );
    const title = screen.getByText('Tarefa de Teste');
    expect(title).toHaveClass('line-through');
  });

  test('chama onDelete ao clicar no botão de excluir', async () => {
    const onDelete = vi.fn();

    render(
      <Task
        task={mockTask}
        onEdit={() => {}}
        onDelete={onDelete}
        onToggleComplete={() => {}}
        loading={false}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /excluir tarefa/i });

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(onDelete).toHaveBeenCalledWith(1); // Espera que onDelete receba o ID da tarefa
  });

  test('mostra spinner se loading for true', () => {
    render(
      <Task
        task={mockTask}
        onEdit={() => {}}
        onDelete={() => {}}
        onToggleComplete={() => {}}
        loading={true}
      />
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
