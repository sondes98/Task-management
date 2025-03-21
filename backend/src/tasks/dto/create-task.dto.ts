import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus, { message: 'Status must be one of: Pending, In Progress, Completed' })
  status: TaskStatus;

  @IsNotEmpty()
  @IsEnum(TaskPriority, { message: 'Priority must be one of: Low, Medium, High' })
  priority: TaskPriority;
} 