export default function TaskModal({ onClose, onSubmit, submitting, editTask }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        role="form"
        data-testid="task-form"
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">
          {editTask ? "Editar Tarefa" : "Nova Tarefa"}
        </h2>
        <input
          type="text"
          name="title"
          defaultValue={editTask?.title || ""}
          required
          placeholder="Título"
          className="w-full mb-3 p-2 border rounded"
        />
        <textarea
          name="description"
          defaultValue={editTask?.description || ""}
          required
          placeholder="Descrição"
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            name="is_completed"
            defaultChecked={editTask?.is_completed === 1}
          />
          Marcar como concluída
        </label>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
