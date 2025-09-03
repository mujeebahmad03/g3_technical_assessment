import { Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
  IsObject,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BetweenDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  min: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  max: number;
}

export class FilterOperationsDto {
  @ApiPropertyOptional({ description: "Equal to" })
  @IsOptional()
  eq?: string | number | boolean | Date;

  @ApiPropertyOptional({ description: "Not equal to" })
  @IsOptional()
  neq?: string | number | boolean | Date;

  @ApiPropertyOptional({ example: "john", description: "Contains string" })
  @IsOptional()
  @IsString()
  contains?: string;

  @ApiPropertyOptional({ example: "john", description: "Starts with string" })
  @IsOptional()
  @IsString()
  startsWith?: string;

  @ApiPropertyOptional({ example: "son", description: "Ends with string" })
  @IsOptional()
  @IsString()
  endsWith?: string;

  @ApiPropertyOptional({ description: "Greater than" })
  @IsOptional()
  gt?: number | Date;

  @ApiPropertyOptional({ description: "Greater than or equal to" })
  @IsOptional()
  gte?: number | Date;

  @ApiPropertyOptional({ description: "Less than" })
  @IsOptional()
  lt?: number | Date;

  @ApiPropertyOptional({ description: "Less than or equal to" })
  @IsOptional()
  lte?: number | Date;

  @ApiPropertyOptional({ type: [String], description: "In array" })
  @IsOptional()
  in?: (string | number | boolean | Date)[];

  @ApiPropertyOptional({ type: [String], description: "Not in array" })
  @IsOptional()
  notIn?: (string | number | boolean | Date)[];

  @ApiPropertyOptional({ description: "Negation flag" })
  @IsOptional()
  not?: boolean;

  @ApiPropertyOptional({ type: () => BetweenDto, description: "Between range" })
  @IsOptional()
  @ValidateNested()
  @Type(() => BetweenDto)
  between?: BetweenDto;

  @ApiPropertyOptional({ description: "Is null check" })
  @IsOptional()
  isNull?: boolean;

  @ApiPropertyOptional({
    type: String,
    format: "date-time",
    description: "Before date",
  })
  @IsOptional()
  before?: Date;

  @ApiPropertyOptional({
    type: String,
    format: "date-time",
    description: "After date",
  })
  @IsOptional()
  after?: Date;

  @ApiPropertyOptional({
    example: "keyName",
    description: "Check if JSON has key",
  })
  @IsOptional()
  @IsString()
  hasKey?: string;

  @ApiPropertyOptional({ type: [String], description: "Path for JSON queries" })
  @IsOptional()
  path?: string[];

  @ApiPropertyOptional({
    type: "object",
    description: "Some condition on relation",
    additionalProperties: true,
  })
  @IsOptional()
  some?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: "object",
    description: "Every condition on relation",
    additionalProperties: true,
  })
  @IsOptional()
  every?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: "object",
    description: "None condition on relation",
    additionalProperties: true,
  })
  @IsOptional()
  none?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: "object",
    description: "Is condition on relation",
    additionalProperties: true,
  })
  @IsOptional()
  is?: Record<string, unknown>;

  @ApiPropertyOptional({ description: "Check if field is set" })
  @IsOptional()
  isSet?: boolean;
}

export class QueryOptionsDto {
  @ApiPropertyOptional({ example: 1, description: "Page number (default: 1)" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: "Items per page (default: 10)",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @ApiPropertyOptional({
    example: "search text",
    description: "Search keyword",
  })
  @IsOptional()
  @IsString()
  searchKey?: string;

  @ApiPropertyOptional({
    type: Object,
    description: "Filter operations per field",
    additionalProperties: { $ref: "#/components/schemas/FilterOperationsDto" },
  })
  @IsOptional()
  @IsObject()
  filters?: Record<string, FilterOperationsDto>;

  @ApiPropertyOptional({
    example: "createdAt:desc",
    description: "Sort field and direction",
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
