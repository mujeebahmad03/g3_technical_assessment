import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsNumber, IsString, IsInt, Min } from "class-validator";

export class PaginationDto {
  @ApiPropertyOptional({
    title: "Page Number",
    description: "The page number",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @ApiPropertyOptional({
    title: "Limit",
    description: "The number of items per page",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 10;
}

export class QueryOptionsDto {
  @ApiPropertyOptional({
    title: "Page Number",
    description: "The page number",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    title: "Limit",
    description: "The number of items per page",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    title: "Search Keyword",
    description: "The keyword to search for data",
  })
  @IsOptional()
  @IsString()
  searchKey?: string;

  @ApiPropertyOptional({
    title: "Filters (JSON string)",
    description:
      'Filter criteria as a JSON string. Example: \'{"status":{"eq":"active"},"age":{"between":{"min":18,"max":65}}}\'',
  })
  @IsOptional()
  @IsString()
  filters?: string;

  @ApiPropertyOptional({
    title: "Sort",
    description: "Sort criteria with field and direction",
    example: "createdAt:desc",
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
