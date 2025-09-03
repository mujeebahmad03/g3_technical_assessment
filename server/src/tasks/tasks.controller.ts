import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import {
  JwtAuthGuard,
  TeamAccessGuard,
  TaskAccessGuard,
} from "src/common/guards";
import { CurrentUser, RequireTeamAccess } from "src/common/decorators";
import { ResponseModel } from "src/models/global.model";
import { TasksService } from "./tasks.service";
import {
  AssignTaskDto,
  CreateTaskDto,
  TaskResponseModel,
  UpdateTaskDto,
} from "./dto";
import { UserSelect } from "src/types/auth.types";
import { QueryOptionsDto } from "src/common/dto";

@ApiTags("Tasks")
@ApiBearerAuth()
@ApiExtraModels(
  AssignTaskDto,
  CreateTaskDto,
  TaskResponseModel,
  UpdateTaskDto,
  ResponseModel,
)
@UseGuards(JwtAuthGuard)
@Controller("teams/:teamId/tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(TeamAccessGuard)
  @RequireTeamAccess()
  @ApiOperation({ summary: "List tasks in a team" })
  @ApiQuery({ name: "queryOptions", type: QueryOptionsDto, required: false })
  @ApiResponse({
    status: 200,
    description: "Tasks fetched successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(TaskResponseModel) },
            },
          },
        },
      ],
    },
  })
  async list(
    @Param("teamId") teamId: string,
    @CurrentUser() user: UserSelect,
    @Query() query: QueryOptionsDto,
  ): Promise<ResponseModel<TaskResponseModel[]>> {
    return this.tasksService.listTasks(teamId, user.id, query);
  }

  @Post()
  @UseGuards(TeamAccessGuard)
  @RequireTeamAccess()
  @ApiOperation({ summary: "Create a task in a team" })
  @ApiResponse({
    status: 201,
    description: "Task created successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        { properties: { data: { $ref: getSchemaPath(TaskResponseModel) } } },
      ],
    },
  })
  async create(
    @Param("teamId") teamId: string,
    @CurrentUser() user: UserSelect,
    @Body() dto: CreateTaskDto,
  ): Promise<ResponseModel<TaskResponseModel>> {
    return this.tasksService.createTask(teamId, user.id, dto);
  }

  @Get(":taskId")
  @UseGuards(TeamAccessGuard, TaskAccessGuard)
  @RequireTeamAccess()
  @ApiOperation({ summary: "Get a task by ID within a team" })
  @ApiResponse({
    status: 200,
    description: "Task fetched successfully",
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        { properties: { data: { $ref: getSchemaPath(TaskResponseModel) } } },
      ],
    },
  })
  async getOne(
    @Param("teamId") teamId: string,
    @Param("taskId") taskId: string,
  ): Promise<ResponseModel<TaskResponseModel>> {
    return this.tasksService.getTask(teamId, taskId);
  }

  @Patch(":taskId")
  @UseGuards(TeamAccessGuard, TaskAccessGuard)
  @RequireTeamAccess()
  @ApiOperation({ summary: "Update a task within a team" })
  async update(
    @Param("teamId") teamId: string,
    @Param("taskId") taskId: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<ResponseModel<TaskResponseModel>> {
    return this.tasksService.updateTask(teamId, taskId, dto);
  }

  @Delete(":taskId")
  @UseGuards(TeamAccessGuard, TaskAccessGuard)
  @RequireTeamAccess()
  @ApiOperation({ summary: "Delete a task within a team" })
  async remove(
    @Param("teamId") teamId: string,
    @Param("taskId") taskId: string,
  ): Promise<ResponseModel<TaskResponseModel>> {
    return this.tasksService.deleteTask(teamId, taskId);
  }

  @Patch(":taskId/assign")
  @UseGuards(TeamAccessGuard, TaskAccessGuard)
  @RequireTeamAccess()
  @ApiOperation({ summary: "Assign a task to a team member" })
  async assign(
    @Param("teamId") teamId: string,
    @Param("taskId") taskId: string,
    @Body() dto: AssignTaskDto,
  ): Promise<ResponseModel<TaskResponseModel>> {
    return this.tasksService.assignTask(teamId, taskId, dto);
  }
}
