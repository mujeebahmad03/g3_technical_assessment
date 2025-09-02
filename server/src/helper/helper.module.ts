import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { HelperService } from "./helper.service";
import { JWTHelperService } from "./jwt-helper.service";
import { ResponseHelperService } from "./response-helper.service";
import { PaginationHelperService } from "./pagination-helper.service";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.getOrThrow("JWT_EXPIRATION"),
        },
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [
    HelperService,
    JWTHelperService,
    ResponseHelperService,
    PaginationHelperService,
  ],

  exports: [
    HelperService,
    JWTHelperService,
    ResponseHelperService,
    PaginationHelperService,
  ],
})
export class HelperModule {}
