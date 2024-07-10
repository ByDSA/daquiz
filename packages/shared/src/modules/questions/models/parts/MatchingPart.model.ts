import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { Part, PartType } from "./Part.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

class SetMatching {
  @IsArray()
  @Type(() => String)
  content!: string[];
}

export class MatchingPart extends Part {
  @IsSpecificString(PartType.Matching)
  type!: PartType.Matching;

  @IsArray()
  @ValidateNested()
  @Type(() => SetMatching)
  sets!: SetMatching[];
}
