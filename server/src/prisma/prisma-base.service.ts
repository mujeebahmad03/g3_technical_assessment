import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Prisma } from "prisma/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

type TransactionOptions = {
  maxWait?: number; // milliseconds to wait for transaction to start
  timeout?: number; // milliseconds before transaction times out
  isolationLevel?: Prisma.TransactionIsolationLevel; // isolation level
};

type PrismaModels = {
  task: Prisma.TaskDelegate<DefaultArgs>;
  // Add other models as needed
  [key: string]: any;
};

@Injectable()
export class PrismaBaseService {
  protected readonly logger: Logger;
  protected readonly prisma: PrismaService;

  constructor(
    prisma: PrismaService,
    serviceName: string = "PrismaBaseService", // Provide default value
  ) {
    this.prisma = prisma;
    this.logger = new Logger(serviceName);
  }

  /**
   * Executes a database operation with error handling
   * @param operation - The database operation to execute
   * @param context - Additional context for error logging
   */
  protected async executeOperation<T>(
    operation: () => Promise<T>,
    context: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleDatabaseError(error, context);
    }
  }

  /**
   * Executes a database transaction with error handling
   * @param transaction - The transaction operations to execute
   * @param context - Additional context for error logging
   * @param options - Transaction options
   */
  protected async executeTransaction<T>(
    transaction: (prisma: Prisma.TransactionClient) => Promise<T>,
    context: string,
    options: TransactionOptions = {
      timeout: 5000,
      maxWait: 2000,
      isolationLevel: "ReadCommitted",
    },
  ): Promise<T> {
    return this.executeOperation(
      () => this.prisma.$transaction(transaction, options),
      context,
    );
  }

  /**
   * Handles database errors and transforms them into appropriate exceptions
   */
  protected handleDatabaseError(error: any, context: string): never {
    this.logger.error(`Database operation failed in ${context}`, error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new BadRequestException("Unique constraint violation");
        case "P2025":
          throw new NotFoundException("Record not found");
        case "P2003":
          throw new BadRequestException("Foreign key constraint violation");
        case "P2014":
          throw new BadRequestException("Invalid ID provided");
        case "P2021":
          throw new InternalServerErrorException("Table does not exist");
        case "P2024":
          throw new InternalServerErrorException("Connection timeout");
        // Add more error codes as needed
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException("Invalid data provided");
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
      throw new InternalServerErrorException(
        "Critical database error occurred",
      );
    }

    throw new InternalServerErrorException("Database operation failed");
  }

  protected async findOneOrFail<
    T extends keyof PrismaModels,
    I extends Prisma.Args<PrismaModels[T], "findUnique">["include"],
    R = Prisma.Result<PrismaModels[T], { include: I }, "findUnique">,
  >(model: T & string, id: string, include?: I): Promise<R> {
    const result = await this.executeOperation(
      () =>
        this.prisma[model.toLowerCase() as keyof PrismaModels].findUnique({
          where: { id },
          include,
        }),
      `finding ${model} with ID ${id}`,
    );

    if (!result) {
      throw new NotFoundException(`${model} with ID ${id} not found`);
    }

    return result as R;
  }
}
