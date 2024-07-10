import { IsOptional, IsString } from "class-validator";
import { Part, PartType } from "./Part.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export class VideoPart extends Part {
  @IsSpecificString(PartType.Video)
  type!: PartType.Video;

  @IsString()
  url!: string;

  @IsString()
  @IsOptional()
  caption?: string;
}
