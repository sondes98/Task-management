import axiosInstance from '../../api/axiosConfig';
import { Task, CreateTaskDto, UpdateTaskDto } from './types';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    console.log('Fetching all tasks');
    const response = await axiosInstance.get<Task[]>('/tasks');
    console.log('Fetched tasks:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching tasks:', error.response?.data || error.message);
    throw new Error('Failed to fetch tasks');
  }
};

export const fetchTaskById = async (id: number): Promise<Task> => {
  try {
    console.log(`Fetching task with id ${id}`);
    const response = await axiosInstance.get<Task>(`/tasks/${id}`);
    console.log(`Fetched task ${id}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching task ${id}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch task: ${error.response?.data?.message || error.message}`);
  }
};

export const createTask = async (taskData: CreateTaskDto): Promise<Task> => {
  try {
    console.log('Creating new task with data:', taskData);
    const response = await axiosInstance.post<Task>('/tasks', taskData);
    console.log('Created task:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating task:', error.response?.data || error.message);
    throw new Error(`Failed to create task: ${error.response?.data?.message || error.message}`);
  }
};

export const updateTask = async (id: number, taskData: UpdateTaskDto): Promise<Task> => {
  try {
    console.log(`Updating task ${id} with data:`, taskData);
    const response = await axiosInstance.put<Task>(`/tasks/${id}`, taskData);
    console.log(`Updated task ${id}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating task ${id}:`, error.response?.data || error.message);
    throw new Error(`Failed to update task: ${error.response?.data?.message || error.message}`);
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    console.log(`Deleting task ${id}`);
    await axiosInstance.delete(`/tasks/${id}`);
    console.log(`Deleted task ${id} successfully`);
  } catch (error: any) {
    console.error(`Error deleting task ${id}:`, error.response?.data || error.message);
    throw new Error(`Failed to delete task: ${error.response?.data?.message || error.message}`);
  }
}; 