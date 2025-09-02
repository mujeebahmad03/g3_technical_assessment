import { Global, Module } from "@nestjs/common";

import { PrismaService } from "./prisma.service";
import { PrismaQueryService } from "./prisma-query.service";
import { PrismaBaseService } from "./prisma-base.service";

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaQueryService,
    {
      provide: PrismaBaseService,
      useFactory: (prisma: PrismaService) => {
        return new PrismaBaseService(prisma);
      },
      inject: [PrismaService],
    },
  ],
  exports: [PrismaService, PrismaQueryService, PrismaBaseService],
})
export class PrismaModule {}
