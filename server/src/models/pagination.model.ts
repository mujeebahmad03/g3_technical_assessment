import { ApiProperty } from "@nestjs/swagger";

export class PaginationModel {
  @ApiProperty({
    title: "Total Items",
    description: "The total number of items",
  })
  totalItems: number;

  @ApiProperty({ title: "Page", description: "The current page number" })
  page: number;

  @ApiProperty({ title: "Limit", description: "The number of items per page" })
  limit: number;

  @ApiProperty({
    title: "Has More",
    description: "Shows if there are more pages",
  })
  hasMore: boolean;
}
