import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Task from "../components/Task";
import TaskModal from "../components/TaskModal";
import { fetchTasks, deleteTask, updateTask, submitTask } from "../api/task";

export default function TaskList() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      if (err.status === 401) logout();
      console.error("Erro ao buscar tarefas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(confirmDeleteId);
      setTasks((t) => t.filter((task) => task.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Erro ao excluir tarefa");
    }
  };

  const handleToggleComplete = async (task) => {
    setCompletingTaskId(task.id);
    try {
      const updated = await updateTask(task);
      setTasks((t) => t.map((tk) => (tk.id === task.id ? updated.task : tk)));
    } catch (err) {
      console.error("Erro ao atualizar tarefa");
    } finally {
      setCompletingTaskId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target;
    const payload = {
      title: form.title.value,
      description: form.description.value,
      is_completed: form.is_completed.checked ? 1 : 0,
    };

    try {
      const data = await submitTask(payload, editTask?.id);
      if (editTask) {
        setTasks((t) => t.map((tk) => (tk.id === data.task.id ? data.task : tk)));
      } else {
        setTasks((t) => [...t, data.task]);
      }
      setEditTask(null);
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao salvar tarefa");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
              onClick={() => setShowModal(true)}
            >
              + Nova Tarefa
            </button>
          </div>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <ClipboardList className="w-20 h-20 text-indigo-500 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700">Nenhuma tarefa por aqui!</h2>
              <p className="text-gray-500 mt-2 mb-6">
                Que tal começar adicionando a sua primeira tarefa agora mesmo?
              </p>
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-all duration-200"
                onClick={() => setShowModal(true)}
              >
                + Nova Tarefa
              </button>
            </div>
          ) : (
            tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                loading={completingTaskId === task.id}
                onEdit={(t) => {
                  setEditTask(t);
                  setShowModal(true);
                }}
                onDelete={() => setConfirmDeleteId(task.id)}
                onToggleComplete={handleToggleComplete}
              />
            ))
          )}
        </div>

        {showModal && (
          <TaskModal
            onClose={() => {
              setEditTask(null);
              setShowModal(false);
            }}
            onSubmit={handleSubmit}
            submitting={submitting}
            editTask={editTask}
          />
        )}

        {confirmDeleteId && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-lg font-semibold mb-4">Confirmar exclusão</h2>
              <p className="mb-4">Tem certeza que deseja excluir esta tarefa?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
