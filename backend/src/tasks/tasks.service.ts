import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.findAll();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne(id);
    
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    
    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    return this.tasksRepository.create(createTaskDto, userId);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.tasksRepository.update(id, updateTaskDto);
    
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    
    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    const result = await this.tasksRepository.remove(id);
    
    if (!result) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
} 