import { IsOptional, IsString } from "class-validator";
import { Part, PartType } from "./Part.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export class ImagePart extends Part {
  @IsSpecificString(PartType.Image)
  type!: PartType.Image;

  @IsString()
  url!: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
