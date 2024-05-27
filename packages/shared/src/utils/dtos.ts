import { IsArray, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

export abstract class ResultCommon {
  @IsOptional()
  @IsString()
  message?: string;

  @IsNumber()
  statusCode?: number;
}

export class ResultOneDto<T> extends ResultCommon {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  data?: T;
};

export class ResultManyDto<T> extends ResultCommon {
  @IsOptional()
  @IsArray()
  @ValidateNested()
  data?: T[];
};
