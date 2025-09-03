import { Module } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { TeamsController } from "./teams.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { HelperModule } from "src/helper/helper.module";

@Module({
  imports: [PrismaModule, HelperModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
