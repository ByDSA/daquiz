import { IsArray, IsObject, IsOptional, ValidateNested } from "class-validator";

export class ResultOneDto<T> {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  data?: T;
};

export class ResultManyDto<T> {
  @IsOptional()
  @IsArray()
  @ValidateNested()
  data?: T[];
};
