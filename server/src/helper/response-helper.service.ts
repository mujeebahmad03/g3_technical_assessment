import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { ResponseModel } from "src/models/global.model";

@Injectable()
export class ResponseHelperService<T> {
  returnSuccessObject(message: string, data?: T): ResponseModel<T> {
    return {
      isSuccessful: true,
      message: message,
      data: data,
    };
  }

  throwBadRequest(message: string): never {
    throw new BadRequestException({
      isSuccessful: false,
      message: message,
    });
  }

  throwNotFound(message: string): never {
    throw new NotFoundException({
      isSuccessful: false,
      message: message,
    });
  }

  throwForbidden(message: string): never {
    throw new ForbiddenException({
      isSuccessful: false,
      message: message,
    });
  }

  throwBadGateway(message: string): never {
    throw new BadGatewayException({
      isSuccessful: false,
      message: message,
    });
  }

  throwInternalServer(message: string, error?: any): never {
    throw new InternalServerErrorException({
      isSuccessful: false,
      message: message,
      error: error,
    });
  }

  throwUnauthorized(message: string): never {
    throw new UnauthorizedException({
      isSuccessful: false,
      message: message,
    });
  }

  throwConflict(message: string): never {
    throw new ConflictException({
      isSuccessful: false,
      message: message,
    });
  }
}
