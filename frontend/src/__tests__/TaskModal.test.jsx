// src/__tests__/TaskModal.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import TaskModal from '../components/TaskModal';
import { vi } from 'vitest';

describe('TaskModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn((e) => e.preventDefault());

  const renderModal = (props = {}) => {
    render(
      <TaskModal
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        submitting={false}
        {...props}
      />
    );
  };

  test('renderiza o modal com título "Nova Tarefa"', () => {
    renderModal();
    expect(screen.getByText('Nova Tarefa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Título')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descrição')).toBeInTheDocument();
  });

  test('renderiza o modal com dados de edição se editTask for passado', () => {
    renderModal({
      editTask: {
        title: 'Tarefa existente',
        description: 'Descrição existente',
        is_completed: 1,
      },
    });

    expect(screen.getByDisplayValue('Tarefa existente')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Descrição existente')).toBeInTheDocument();
    expect(screen.getByLabelText(/marcar como concluída/i).checked).toBe(true);
  });

  test('dispara onSubmit ao enviar o formulário', () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText('Título'), {
      target: { value: 'Nova tarefa' },
    });
    fireEvent.change(screen.getByPlaceholderText('Descrição'), {
      target: { value: 'Descrição da nova tarefa' },
    });

    fireEvent.submit(screen.getByTestId('task-form'));  // ✅ Atualizado

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('dispara onClose ao clicar em "Cancelar"', () => {
    renderModal();
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
