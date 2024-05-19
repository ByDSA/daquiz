import { BadRequestException, PipeTransform } from "@nestjs/common";

function isObjectId(value: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

export class ObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isObjectId(value))
      throw new BadRequestException("Invalid ID");

    return value;
  }
}
