import { ArrayMinSize, IsOptional, Validate } from "class-validator";
import { IsArrayPartContent } from "../ArrayPart.model";
import { LeafPart, LeafPartTypes } from "../LeafPart";
import { Part, PartType } from "../Part.model";
import { IsValidPickConstraint, Pick } from "./Pick";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export type Choice = LeafPart;

export class ChoicesPart extends Part {
  @IsSpecificString(PartType.Choices)
  type!: PartType.Choices;

  @IsOptional()
  @Validate(IsValidPickConstraint)
  pick?: Pick;

  @ArrayMinSize(1)
  @IsArrayPartContent( {
    onlyTypes: LeafPartTypes,
  } )
  choices!: Choice[];
}
