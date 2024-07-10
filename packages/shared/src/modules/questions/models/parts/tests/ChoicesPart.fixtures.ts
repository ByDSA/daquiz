import { ChoicesPart } from "../ChoicesPart.model";
import { PartType } from "../Part.model";
import { generateValidTextPart } from "./TextPart.fixtures";

export function generateValidChoicesPart() {
  const ret = new ChoicesPart();

  ret.type = PartType.Choices;
  const textPart = generateValidTextPart();

  ret.choices = [
    textPart,
  ];

  return ret;
}

export function generateInvalidChoicesPart(): ChoicesPart {
  const ret = generateValidChoicesPart();

  ret.type = "invalid-type" as any;

  return ret;
}
