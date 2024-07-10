import { AnswerType } from "../../AnswerType.enum";
import { SetAnswerVO } from "../../SetAnswer.model";
import { generateInvalidItemSetAnswerVO, generateValidItemSetAnswerVO } from "./ItemSetAnswer.fixtures";

export const generateValidSetAnswerVO = () => {
  const ret = new SetAnswerVO();

  ret.type = AnswerType.Set;
  ret.set = [
    generateValidItemSetAnswerVO(),
  ];

  return ret;
};

export const generateInvalidSetAnswerVO = () => {
  const ret = generateValidSetAnswerVO();

  ret.set = [generateInvalidItemSetAnswerVO()];

  return ret;
};
