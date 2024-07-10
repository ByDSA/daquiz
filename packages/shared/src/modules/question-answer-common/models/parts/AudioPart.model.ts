import { IsOptional, IsString } from "class-validator";
import { Part, PartType } from "./Part.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export class AudioPart extends Part {
  @IsSpecificString(PartType.Audio)
  type!: PartType.Audio;

  @IsString()
  url!: string;

  @IsString()
  @IsOptional()
  caption?: string;
}
