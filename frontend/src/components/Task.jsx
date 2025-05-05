import { Pencil, Trash2 } from "lucide-react";

export default function Task({ task, onEdit, onDelete, onToggleComplete, loading }) {
  return (
    <div className="bg-white p-6 min-h-[160px] rounded-xl mb-4 shadow flex justify-between items-start gap-4 border-l-4 transition-all duration-300 border-indigo-500 hover:shadow-lg">
      <div className="flex-1">
        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
          {loading ? (
            <div
              role="status"
              className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"
            />
          ) : (
            <input
              type="checkbox"
              checked={task.is_completed === 1}
              onChange={() => onToggleComplete(task)}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
            />
          )}
          <span className={`text-2xl font-bold ${task.is_completed ? "line-through text-gray-400" : "text-gray-800"}`}>
            {task.title}
          </span>
        </label>

        <p className={`text-base mt-2 ${task.is_completed ? "text-gray-400 line-through" : "text-gray-600"}`}>
          {task.description}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={() => onEdit(task)}
          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
          title="Editar tarefa"
          aria-label="Editar tarefa"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
          title="Excluir tarefa"
          aria-label="Excluir tarefa"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
