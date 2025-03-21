import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be one of: Pending, In Progress, Completed' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority must be one of: Low, Medium, High' })
  priority?: TaskPriority;
} 