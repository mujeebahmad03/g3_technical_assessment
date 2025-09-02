import { ApiProperty } from "@nestjs/swagger";

import { PaginationModel } from "./pagination.model";

export class ResponseModel<T, M = PaginationModel> {
  @ApiProperty({
    description: "Status of the API Call",
    title: "API Status Response",
  })
  isSuccessful: boolean;
  @ApiProperty({
    description:
      "API response message. This will be the display message in case of an error or where a message needs to be displayed",
    title: "API Status Response Message",
  })
  message: string;
  @ApiProperty({
    title: "API Response Data",
    description:
      "API Response Data. This is the data of dto for any API Request. This will be empty if we do not expect any data",
  })
  data?: T;
  @ApiProperty({
    title: "API Response Data",
    description:
      "API Response Data. This is the data of dto for any API Request. This will be empty if we do not expect any data",
  })
  meta?: M;
}

export enum Constants {
  NEW_USER_CREATED = "NEW_USER_CREATED",
  PASS_DEBIT = "PASS_DEBIT",
  PASS_CREDIT = "PASS_CREDIT",
  LOGIN = "LOGIN",
  PASS_FAILED = "FAILED",
  FORGET_PASSWORD = "FORGET_PASSWORD",
  VERIFY_EMAIL = "VERIFY_EMAIL",
  RESET_PASSWORD = "RESET_PASSWORD",
  NEW_USER_ADMIN_CREATED = "NEW_USER_ADMIN_CREATED",
  OLD_USER_ADMIN_CREATED = "OLD_USER_ADMIN_CREATED",
  BUSINESS_INVITE_SENT = "BUSINESS_INVITE_SENT",
}
