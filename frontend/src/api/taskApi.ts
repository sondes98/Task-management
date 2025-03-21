import axios from 'axios';
import { Task } from '../features/tasks/types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend URL
});

export const fetchTasks = async (token: string): Promise<Task[]> => {
  const response = await api.get('/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addTask = async (task: Omit<Task, 'id'>, token: string): Promise<Task> => {
  const response = await api.post('/tasks', task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTask = async (task: Task, token: string): Promise<Task> => {
  const response = await api.put(`/tasks/${task.id}`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};