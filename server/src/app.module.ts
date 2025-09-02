import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { HelperModule } from "./helper/helper.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { TeamsModule } from "./teams/teams.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    LoggerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level:
            configService.get<string>("NODE_ENV") === "production"
              ? "info"
              : "debug",
          transport:
            configService.get<string>("NODE_ENV") !== "production"
              ? { target: "pino-pretty", options: { colorize: true } }
              : undefined,
        },
      }),

      inject: [ConfigService], // Inject ConfigService for dynamic configuration
    }),
    PrismaModule,
    HelperModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
