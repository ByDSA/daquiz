import { PartType } from "../Part.model";
import { TextPart } from "../TextPart.model";

export const generateValidTextPart = () => {
  const textPart = new TextPart();

  textPart.type = PartType.Text;
  textPart.text = "Valid text";

  return textPart;
};

export const generateInvalidTextPart = () => {
  const textPart = new TextPart();

  textPart.type = PartType.Text;
  textPart.text = 123 as any;

  return textPart;
};
