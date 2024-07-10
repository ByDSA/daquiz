import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, ValidateNested } from "class-validator";
import { IsArrayPartContent } from "./ArrayPart.model";
import { LeafPart, LeafPartTypes } from "./LeafPart";
import { Part, PartType } from "./Part.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

class Set {
  @ArrayMinSize(1)
  @IsArrayPartContent( {
    onlyTypes: LeafPartTypes,
  } )
  content!: LeafPart[];
}

export enum SetsObjectiveType {
  Matching = "matching",
  Sequencing = "sequencing",
}

export class SetsPart extends Part {
  @IsSpecificString(PartType.Sets)
  type!: PartType.Sets;

  @IsEnum(SetsObjectiveType)
  objective!: SetsObjectiveType;

  @IsArray()
  @ValidateNested()
  @Type(() => Set)
  sets!: Set[];
}
