import { isObjectId } from "#shared/utils/validation";
import { BadRequestException, PipeTransform } from "@nestjs/common";
export class ObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isObjectId(value))
      throw new BadRequestException("Invalid ID");

    return value;
  }
}

export class BooleanPipe implements PipeTransform<string | undefined, boolean> {
  transform(value: string | undefined): boolean {
    if (value === undefined)
      return false;

    switch (value.toLocaleLowerCase()) {
      case "true":
      case "1":
        return true;
      case "":
      case "0":
      case "false":
        return false;
      default:
        throw new BadRequestException("Invalid boolean");
    }
  }
}
