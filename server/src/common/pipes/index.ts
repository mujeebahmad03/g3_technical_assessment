import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isCuid } from "@paralleldrive/cuid2";

@Injectable()
export class ParseCuidPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!value || !isCuid(value)) {
      throw new BadRequestException("Invalid CUID");
    }
    return value;
  }
}
