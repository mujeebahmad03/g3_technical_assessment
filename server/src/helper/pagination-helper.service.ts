import { Injectable, NotFoundException } from "@nestjs/common";
import { ResponseModel } from "src/models/global.model";
import { Pagination } from "src/types";

@Injectable()
export class PaginationHelperService<T> {
  returnSuccessObjectWithPagination(
    message: string,
    data: T,
    pagination: Pagination,
  ): ResponseModel<T> {
    return {
      isSuccessful: true,
      message: message,
      data: data,
      meta: pagination,
    };
  }

  throwNotFound(message: string) {
    throw new NotFoundException({
      isSuccessful: true,
      message: message,
    });
  }
}
