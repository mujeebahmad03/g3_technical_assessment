import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as compression from "compression";
import helmet from "helmet";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module";
import {
  AllExceptionsFilter,
  ValidationExceptionFilter,
} from "./common/filters";

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const httpAdapterHost = app.get(HttpAdapterHost);

  // Security Headers
  app.use(helmet());

  // Compression
  app.use(compression());

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Setup Pino logger
  app.useLogger(app.get(Logger));

  // Global Exception Filters
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapterHost),
    new ValidationExceptionFilter(),
  );

  // Enable Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.set("query parser", "extended");

  // Global API prefix
  app.setGlobalPrefix("api/v1", {
    exclude: [{ path: "/", method: RequestMethod.GET }],
  });

  // Swagger Setup (only in non-production)
  if (configService.get("NODE_ENV") !== "production") {
    const config = new DocumentBuilder()
      .setTitle(configService.get("APP_NAME", "G3 TTM"))
      .setDescription(
        configService.get("SWAGGER_DESCRIPTION", "API Documentation"),
      )
      .setVersion(configService.get("SWAGGER_VERSION", "1.0"))
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);
  }

  const port = configService.get<number>("PORT", 3030);

  await app.listen(port);

  console.log(`
    🚀 Application is running on: http://localhost:${port}
    📝 API Documentation: http://localhost:${port}/docs
      `);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
