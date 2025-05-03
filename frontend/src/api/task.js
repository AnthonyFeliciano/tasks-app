// src/api/task.api.js
import { apiFetch } from "./httpClient";

export async function fetchTasks() {
  return apiFetch("/tasks");
}

export async function deleteTask(id) {
  return apiFetch(`/tasks/${id}`, { method: "DELETE" });
}

export async function updateTask(task) {
  return apiFetch(`/tasks/${task.id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...task,
      is_completed: task.is_completed === 1 ? 0 : 1,
    }),
  });
}

export async function submitTask(task, editId = null) {
  const url = editId ? `/tasks/${editId}` : `/tasks`;
  const method = editId ? "PUT" : "POST";

  return apiFetch(url, {
    method,
    body: JSON.stringify(task),
  });
}
