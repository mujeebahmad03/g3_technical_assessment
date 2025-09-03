import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { TaskStatus, TaskPriority } from "prisma/generated/prisma/enums";

export class CreateTaskDto {
  @ApiProperty({ example: "Implement login", description: "Task title" })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    example: "Use OAuth2",
    description: "Task description",
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: "2025-10-01", description: "Due date" })
  @IsOptional()
  @IsDate()
  dueDate?: Date;
}

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: "2025-10-01" })
  @IsOptional()
  @IsDate()
  dueDate?: string;
}

export class AssignTaskDto {
  @ApiProperty({ description: "User ID of the assignee" })
  @IsString()
  assigneeId: string;
}

export class TaskResponseModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty({ nullable: true })
  description: string | null;
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;
  @ApiProperty({ enum: TaskPriority })
  priority: TaskPriority;
  @ApiProperty({ nullable: true, type: String, format: "date-time" })
  dueDate: Date | null;
  @ApiProperty({ nullable: true, type: String, format: "date-time" })
  completedAt: Date | null;
  @ApiProperty()
  teamId: string;
  @ApiProperty()
  createdBy: string;
  @ApiProperty({ nullable: true })
  assignedTo: string | null;
  @ApiProperty({ type: String, format: "date-time" })
  createdAt: Date;
  @ApiProperty({ type: String, format: "date-time" })
  updatedAt: Date;
}
