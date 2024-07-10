import { AnswerType } from "../../AnswerType.enum";
import { ArrayAnswerVO } from "../../ArrayAnswer.model";
import { ArrayType } from "../ArrayType";
import { generateInvalidItemArrayAnswerVO, generateValidItemArrayAnswerVO } from "./ItemArrayAnswer.fixtures";

export const generateValidArrayAnswerVO = () => {
  const ret = new ArrayAnswerVO();

  ret.arrayType = ArrayType.List;
  ret.type = AnswerType.Array;
  ret.content = [
    generateValidItemArrayAnswerVO(),
  ];

  return ret;
};

export const generateInvalidArrayAnswerVO = () => {
  const ret = generateValidArrayAnswerVO();

  ret.content = [generateInvalidItemArrayAnswerVO()];

  return ret;
};
