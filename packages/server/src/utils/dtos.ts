import { IsObject, ValidateNested } from "class-validator";

export class ResultOneDto<T> {
  @IsObject()
  @ValidateNested()
  data: T | null;
};

export class ResultManyDto<T> {
  data: T[];
};
