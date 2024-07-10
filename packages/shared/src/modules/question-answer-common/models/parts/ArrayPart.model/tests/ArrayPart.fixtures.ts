import { ArrayPart } from "..";
import { PartType } from "../../Part.model";
import { generateValidTextPart } from "../../tests/TextPart.fixtures";

export function generateValidChoicesPart() {
  const ret = new ArrayPart();

  ret.type = PartType.Array;
  const textPart = generateValidTextPart();

  ret.content = [
    textPart,
  ];

  return ret;
}

export function generateInvalidChoicesPart(): ArrayPart {
  const ret = generateValidChoicesPart();

  ret.type = "invalid-type" as any;

  return ret;
}
