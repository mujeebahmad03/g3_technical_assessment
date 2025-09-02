import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PaginationHelperService } from "src/helper/pagination-helper.service";
import { HelperService } from "src/helper/helper.service";
import { ResponseModel } from "src/models/global.model";
import { QueryOptions } from "src/common/interfaces";
import { Prisma } from "prisma/generated/prisma/client";

interface FetchDataOptions<T extends keyof PrismaService> {
  model: T;
  queryOptions: QueryOptions;
  searchableFields: string[];
  relations?: {
    [key: string]:
      | string[]
      | {
          select: {
            [key: string]:
              | string[]
              | {
                  select: {
                    [key: string]: string[];
                  };
                };
          };
        };
  };
  selectedFields?: string[];
  transformFn?: (data: any) => any;
}

@Injectable()
export class PrismaQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly multipleResponseHelper: PaginationHelperService<any[]>,
    private readonly helperService: HelperService,
  ) {}

  async fetchData<T extends keyof PrismaService>(
    options: FetchDataOptions<T>,
  ): Promise<ResponseModel<any[]>> {
    try {
      const {
        model,
        queryOptions = {},
        searchableFields,
        relations = {},
        selectedFields = [],
        transformFn,
      } = options;

      const { page = 0, limit = 0, searchKey, filters, sort } = queryOptions;

      // Construct Prisma query object
      const prismaQuery: Prisma.UserFindManyArgs = {};

      // Only apply pagination if limit is greater than 0
      if (limit > 0) {
        prismaQuery.skip = (page - 1) * limit;
        prismaQuery.take = limit;
      }

      // Filters
      if (filters) {
        prismaQuery.where = Object.entries(filters).reduce(
          (acc, [key, operations]) => {
            if (typeof operations === "object" && operations !== null) {
              const whereCondition = {};

              // Process all filter operations
              Object.entries(operations).forEach(([op, value]) => {
                switch (op) {
                  // Equality operators
                  case "eq":
                    whereCondition["equals"] = value;
                    if (typeof value === "string") {
                      whereCondition["mode"] = "insensitive";
                    }
                    break;
                  case "neq":
                    whereCondition["not"] = { equals: value };
                    if (typeof value === "string") {
                      whereCondition["not"]["mode"] = "insensitive";
                    }
                    break;

                  // Text operators
                  case "contains":
                    whereCondition["contains"] = value;
                    whereCondition["mode"] = "insensitive";
                    break;
                  case "startsWith":
                    whereCondition["startsWith"] = value;
                    whereCondition["mode"] = "insensitive";
                    break;
                  case "endsWith":
                    whereCondition["endsWith"] = value;
                    whereCondition["mode"] = "insensitive";
                    break;

                  // Numeric comparison operators
                  case "gt":
                    whereCondition["gt"] = value;
                    break;
                  case "gte":
                    whereCondition["gte"] = value;
                    break;
                  case "lt":
                    whereCondition["lt"] = value;
                    break;
                  case "lte":
                    whereCondition["lte"] = value;
                    break;

                  // List operators
                  case "in":
                    whereCondition["in"] = value;
                    break;
                  case "notIn":
                    whereCondition["notIn"] = value;
                    break;

                  // Boolean operators
                  case "not":
                    whereCondition["not"] = value;
                    break;

                  // Custom range operator
                  case "between":
                    whereCondition["gte"] = value.min;
                    whereCondition["lte"] = value.max;
                    break;

                  // Null checks
                  case "isNull":
                    if (value === true) {
                      whereCondition["equals"] = null;
                    } else {
                      whereCondition["not"] = { equals: null };
                    }
                    break;

                  // Custom date operators
                  case "before":
                    whereCondition["lt"] = new Date(value);
                    break;
                  case "after":
                    whereCondition["gt"] = new Date(value);
                    break;

                  // JSON operators
                  case "hasKey":
                    whereCondition["path"] = [value];
                    whereCondition["not"] = { equals: null };
                    break;
                  case "path":
                    whereCondition["path"] = value;
                    break;

                  // Relation operators
                  case "some":
                    whereCondition["some"] = value;
                    break;
                  case "every":
                    whereCondition["every"] = value;
                    break;
                  case "none":
                    whereCondition["none"] = value;
                    break;
                  case "is":
                    whereCondition["is"] = value;
                    break;
                  case "isSet":
                    if (value === true) {
                      whereCondition["isNot"] = null;
                    } else {
                      whereCondition["is"] = null;
                    }
                    break;

                  default:
                    // For any unmapped operations, pass them through
                    whereCondition[op] = value;
                }
              });

              acc[key] = whereCondition;
            } else if (
              typeof operations === "string" ||
              typeof operations === "number" ||
              typeof operations === "boolean"
            ) {
              // Direct value (no operation)
              acc[key] = {
                equals: operations,
                ...(typeof operations === "string"
                  ? { mode: "insensitive" }
                  : {}),
              };
            } else {
              // Other types
              acc[key] = operations;
            }

            return acc;
          },
          {},
        );
      }

      console.log("Filters parsed:", JSON.stringify(filters, null, 2));
      console.log(
        "Where clause generated:",
        JSON.stringify(prismaQuery.where, null, 2),
      );

      // Searching
      if (searchKey) {
        prismaQuery.where = {
          ...prismaQuery.where,
          OR: searchableFields.map((field) => ({
            [field]: { contains: searchKey, mode: "insensitive" },
          })),
        };
      }

      // Sorting
      if (sort) {
        const [field, direction] = sort.split(":");
        prismaQuery.orderBy = {
          [field]: direction?.toLowerCase() === "desc" ? "desc" : "asc",
        };
      }

      // Select fields for the main model
      if (selectedFields.length > 0) {
        prismaQuery.select = selectedFields.reduce(
          (acc, field) => {
            acc[field] = true;
            return acc;
          },
          {} as Record<string, boolean>,
        );
      }

      // Include specific fields from relations
      if (Object.keys(relations).length > 0) {
        prismaQuery.include = this.buildIncludeObject(relations);
      }

      // Access model dynamically and fetch data
      const results = await (this.prisma[model] as any).findMany(prismaQuery);
      const totalCount = await (this.prisma[model] as any).count({
        where: prismaQuery.where,
      });

      const transformedResults = transformFn ? transformFn(results) : results;

      // Only return pagination data if limit is greater than 0
      const paginatedData =
        limit > 0
          ? this.helperService.paginate(totalCount, page, limit)
          : {
              totalItems: totalCount,
              page: 1,
              limit: totalCount,
              totalPages: 1,
              hasMore: false,
              pageSize: totalCount,
            };

      return this.multipleResponseHelper.returnSuccessObjectWithPagination(
        "Data fetched successfully",
        transformedResults,
        paginatedData,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        switch (error.code) {
          case "P2025":
            throw new NotFoundException("Record not found");
          case "P2003":
            throw new BadRequestException(
              "Invalid relation or foreign key constraint failed",
            );
          case "P2006":
            throw new BadRequestException("Invalid data provided");
          default:
            throw new BadRequestException(`Database error: ${error.message}`);
        }
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        // Handle validation errors (like invalid field names)
        throw new BadRequestException(
          "Invalid query parameters or field names",
        );
      } else {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
        throw new InternalServerErrorException("An unexpected error occurred");
      }
    }
  }

  private buildIncludeObject(relations?: FetchDataOptions<any>["relations"]) {
    return Object.entries(relations ?? {}).reduce((acc, [relation, fields]) => {
      if (Array.isArray(fields)) {
        // Handle simple field selection
        acc[relation] = {
          select: fields.reduce(
            (fieldAcc, field) => ({ ...fieldAcc, [field]: true }),
            {},
          ),
        };
      } else if (typeof fields === "object") {
        // Handle nested relations
        acc[relation] = {
          select: Object.entries(fields.select).reduce(
            (selectAcc, [key, value]) => {
              if (Array.isArray(value)) {
                selectAcc[key] = {
                  select: value.reduce(
                    (fieldAcc, field) => ({ ...fieldAcc, [field]: true }),
                    {},
                  ),
                };
              } else if (typeof value === "object") {
                selectAcc[key] = value;
              }
              return selectAcc;
            },
            {},
          ),
        };
      }
      return acc;
    }, {});
  }
}
