import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseHelperService } from "src/helper/response-helper.service";
import { PaginationHelperService } from "src/helper/pagination-helper.service";
import { HelperService } from "src/helper/helper.service";
import { ResponseModel } from "src/models/global.model";
import { QueryOptionsDto } from "src/common/dto";
import {
  AssignTaskDto,
  CreateTaskDto,
  TaskResponseModel,
  UpdateTaskDto,
} from "./dto";
import { Prisma } from "prisma/generated/prisma/client";
import { TaskPriority } from "prisma/generated/prisma/enums";

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly taskResponseHelper: ResponseHelperService<TaskResponseModel>,
    private readonly tasksResponseHelper: PaginationHelperService<
      TaskResponseModel[]
    >,
    private readonly helperService: HelperService,
  ) {}

  async listTasks(
    teamId: string,
    userId: string,
    query?: QueryOptionsDto,
  ): Promise<ResponseModel<TaskResponseModel[]>> {
    const { limit = 10, page = 1, searchKey = "" } = query || {};
    const skip = (page - 1) * limit;

    // ensure membership
    const isMember = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
      select: { id: true },
    });

    if (!isMember) {
      this.taskResponseHelper.throwForbidden(
        "You don't have access to this team",
      );
    }

    const whereClause: Prisma.TaskWhereInput = {
      teamId,
      ...(searchKey
        ? {
            OR: [
              { title: { contains: searchKey, mode: "insensitive" } },
              { description: { contains: searchKey, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [tasks, count] = await Promise.all([
      this.prisma.task.findMany({
        where: whereClause,
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              email: true,
              profileImage: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where: whereClause }),
    ]);

    const pagination = this.helperService.paginate(count, page, limit);

    return this.tasksResponseHelper.returnSuccessObjectWithPagination(
      "Tasks retrieved successfully",
      tasks,
      pagination,
    );
  }

  async createTask(
    teamId: string,
    creatorId: string,
    dto: CreateTaskDto,
  ): Promise<ResponseModel<TaskResponseModel>> {
    // ensure creator is member
    const isMember = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId: creatorId, teamId } },
      select: { id: true },
    });

    if (!isMember) {
      this.taskResponseHelper.throwForbidden(
        "You don't have access to this team",
      );
    }

    await this.prisma.task.create({
      data: {
        teamId,
        createdBy: creatorId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority || TaskPriority.MEDIUM,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });

    return this.taskResponseHelper.returnSuccessObject(
      "Task created successfully",
    );
  }

  async getTask(
    teamId: string,
    taskId: string,
  ): Promise<ResponseModel<TaskResponseModel>> {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.teamId !== teamId) {
      this.taskResponseHelper.throwNotFound("Task not found");
    }

    return this.taskResponseHelper.returnSuccessObject(
      "Task retrieved successfully",
      task,
    );
  }

  async updateTask(
    teamId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<ResponseModel<TaskResponseModel>> {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.teamId !== teamId) {
      this.taskResponseHelper.throwNotFound("Task not found");
    }

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || undefined,
        priority: dto.priority || undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        completedAt:
          dto.status !== undefined
            ? dto.status === "DONE"
              ? new Date()
              : null
            : undefined,
      },
    });

    return this.taskResponseHelper.returnSuccessObject(
      "Task updated successfully",
      updated,
    );
  }

  async deleteTask(
    teamId: string,
    taskId: string,
  ): Promise<ResponseModel<TaskResponseModel>> {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.teamId !== teamId) {
      this.taskResponseHelper.throwNotFound("Task not found");
    }

    await this.prisma.task.delete({ where: { id: taskId } });

    return this.taskResponseHelper.returnSuccessObject(
      "Task deleted successfully",
    );
  }

  async assignTask(
    teamId: string,
    taskId: string,
    dto: AssignTaskDto,
  ): Promise<ResponseModel<TaskResponseModel>> {
    // ensure assignee is member of same team
    const member = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId: dto.assigneeId, teamId } },
      select: { id: true },
    });

    if (!member) {
      this.taskResponseHelper.throwBadRequest(
        "Assignee must be a member of the team",
      );
    }

    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.teamId !== teamId) {
      this.taskResponseHelper.throwNotFound("Task not found");
    }

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: { assignedTo: dto.assigneeId },
    });

    return this.taskResponseHelper.returnSuccessObject(
      "Task assigned successfully",
      updated,
    );
  }
}
