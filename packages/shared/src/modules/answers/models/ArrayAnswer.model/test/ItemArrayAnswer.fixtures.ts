import { ArrayItem } from "../ArrayAnswer.model";
import { PartType, TextPart } from "#modules/questions/models";

export const generateValidTextItemArrayAnswerVO = () => {
  const ret = new TextPart();

  ret.type = PartType.Text;
  ret.text = "Valid text";

  return ret;
};

export const generateValidItemArrayAnswerVO = generateValidTextItemArrayAnswerVO as ()=> ArrayItem;

export const generateInvalidTextItemArrayAnswerVO = () => {
  const ret = generateValidTextItemArrayAnswerVO();

  ret.text = 123 as any;

  return ret;
};

// eslint-disable-next-line max-len
export const generateInvalidItemArrayAnswerVO = generateInvalidTextItemArrayAnswerVO as ()=> ArrayItem;
