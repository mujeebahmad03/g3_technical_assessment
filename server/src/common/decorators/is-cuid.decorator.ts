import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { isCuid } from "@paralleldrive/cuid2";

export function IsCuid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isCuid",
      target: (object as any).constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return typeof value === "string" && isCuid(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${(args as any).property} must be a valid CUID`;
        },
      },
    });
  };
}
