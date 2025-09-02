import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { ErrorResponse } from "../interfaces";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    // Log the exception
    this.logException(exception);

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = "Internal server error";
    let error = "Internal Server Error";

    // Handle HTTP Exceptions
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      message =
        typeof response === "object" ? (response as any).message : response;
      error = exception.name;
    }
    // Handle Prisma Errors
    else if (exception instanceof PrismaClientKnownRequestError) {
      const prismaError = this.handlePrismaError(exception);
      statusCode = prismaError.statusCode;
      message = prismaError.message;
      error = prismaError.error;
    }

    const responseBody: ErrorResponse = {
      isSuccessful: false,
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }

  private handlePrismaError(error: PrismaClientKnownRequestError): {
    statusCode: number;
    message: string;
    error: string;
  } {
    switch (error.code) {
      case "P2002":
        return {
          statusCode: HttpStatus.CONFLICT,
          message: "Unique constraint violation",
          error: "Conflict",
        };
      case "P2025":
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Record not found",
          error: "Not Found",
        };
      case "P2003":
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Foreign key constraint failed",
          error: "Bad Request",
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Database error occurred",
          error: "Internal Server Error",
        };
    }
  }

  private logException(exception: unknown): void {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message =
        typeof response === "object" ? (response as any).message : response;
      this.logger.error(
        `HTTP Exception: ${exception.name} - ${message}`,
        exception.stack,
      );
    } else if (exception instanceof PrismaClientKnownRequestError) {
      this.logger.error(
        `Prisma Error: ${exception.code} - ${exception.message}`,
        exception.stack,
      );
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unexpected Error: ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.error(`Unknown Exception: ${JSON.stringify(exception)}`);
    }
  }
}
