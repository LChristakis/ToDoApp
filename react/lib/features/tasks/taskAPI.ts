import { Task } from './taskSlice';

export const fetchTasksRequest = async () => {
  const response = await fetch("http://localhost:5001/api/tasks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result: { tasks: Task[] } = await response.json();

  return result;
}

export const createTaskRequest = async (task: Task) => {
  const response = await fetch("http://localhost:5001/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const result: Task = await response.json();

  return result;
}

export const updateTaskRequest = async (task: Task) => {
  const { title, description, status } = task;
  const url = `http://localhost:5001/api/task/${task.id}?title=${title}&description=${description}&status=${status}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  const result: Task = await response.json();

  return result;
}

export const deleteTaskRequest = async (taskId: number) => {
  const url = `http://localhost:5001/api/task/${taskId}`;
  const response = await fetch(url, {
    method: "DELETE",
  });
  await response.status;

  return taskId;
}