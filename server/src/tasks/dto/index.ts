import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { TaskStatus, TaskPriority } from "prisma/generated/prisma/enums";
import { UserResponseModel } from "src/models/auth.model";

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
  @ApiProperty({
    description: "Unique identifier of the task",
    example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
  })
  id: string;

  @ApiProperty({
    description: "Title of the task",
    example: "Design landing page",
  })
  title: string;

  @ApiProperty({
    description: "Detailed description of the task",
    nullable: true,
    example: "Create responsive landing page with Tailwind and React",
  })
  description: string | null;

  @ApiProperty({
    description: "Current status of the task",
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  status: TaskStatus;

  @ApiProperty({
    description: "Priority level of the task",
    enum: TaskPriority,
    example: TaskPriority.HIGH,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: "Due date of the task (nullable)",
    nullable: true,
    type: String,
    format: "date-time",
    example: "2025-09-10T14:48:00.000Z",
  })
  dueDate: Date | null;

  @ApiProperty({
    description: "Date when the task was completed (nullable)",
    nullable: true,
    type: String,
    format: "date-time",
    example: null,
  })
  completedAt: Date | null;

  @ApiProperty({
    description: "ID of the team the task belongs to",
    example: "team_12345",
  })
  teamId: string;

  @ApiProperty({
    description: "ID of the user who created the task",
    example: "user_67890",
  })
  createdBy: string;

  @ApiProperty({
    description: "ID of the user assigned to this task (nullable)",
    nullable: true,
    example: "user_13579",
  })
  assignedTo: string | null;

  @ApiProperty({
    description: "Full details of the assigned user (nullable)",
    nullable: true,
    type: () => UserResponseModel,
    example: {
      id: "user_13579",
      email: "assignee@example.com",
      firstName: "Jane",
      lastName: "Doe",
    },
  })
  assignee?: UserResponseModel | null;

  @ApiProperty({
    description: "Timestamp when the task was created",
    type: String,
    format: "date-time",
    example: "2025-09-05T12:34:56.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Timestamp when the task was last updated",
    type: String,
    format: "date-time",
    example: "2025-09-05T15:22:10.000Z",
  })
  updatedAt: Date;
}
