import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TypedAuthRequest } from "../interfaces";
import { Role } from "prisma/generated/prisma/enums";

@Injectable()
export class TaskAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TypedAuthRequest>();
    const user = request.user;
    const teamMember = request.teamMember;
    const taskId = request.params.taskId || request.params.id;

    if (!taskId) {
      throw new ForbiddenException("Task ID is required");
    }

    if (!user || !teamMember) {
      throw new ForbiddenException(
        "Authentication and team membership required",
      );
    }

    // Fetch the task with proper typing
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        creator: { select: { id: true } },
        assignee: { select: { id: true } },
        team: { select: { id: true } },
      },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    // Check if task belongs to the same team
    if (task.team.id !== teamMember.teamId) {
      throw new ForbiddenException("Task does not belong to your team");
    }

    const method = request.method;

    // For GET requests, all team members can view tasks
    if (method === "GET") {
      return true;
    }

    // For POST (create), all team members can create tasks
    if (method === "POST") {
      return true;
    }

    // For PUT/PATCH/DELETE, check permissions
    if (["PUT", "PATCH", "DELETE"].includes(method)) {
      // Admins can edit/delete any task in their team
      if (teamMember.role === Role.ADMIN) {
        return true;
      }

      // Members can only edit/delete tasks they created or are assigned to
      if (teamMember.role === Role.MEMBER) {
        const isCreator = task.creator?.id === user.id;
        const isAssignee = task.assignee?.id === user.id;

        if (isCreator || isAssignee) {
          return true;
        }

        throw new ForbiddenException(
          "You can only edit/delete tasks you created or are assigned to",
        );
      }
    }

    throw new ForbiddenException("Insufficient permissions");
  }
}
