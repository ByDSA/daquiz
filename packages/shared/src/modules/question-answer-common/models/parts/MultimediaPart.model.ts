import { IsOptional, IsString } from "class-validator";
import { Part } from "./Part.model";

export abstract class MultimediaPart extends Part {
  @IsString()
  url!: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  name!: string;
}
