import { generateValidImagePart } from "../parts/tests/ImagePart.fixtures";
import { generateInvalidTextPart, generateValidTextPart } from "../parts/tests/TextPart.fixtures";
import { QuestionVO } from "../Question.model";
import { TextQuestionVO } from "../TextQuestion.model";

export const generateValidTextQuestionVO = () => {
  const ret = new TextQuestionVO();

  ret.parts = [
    generateValidTextPart(),
  ];

  return ret;
};

export const generateValidQuestionTextWithImageVO = () => {
  const ret = new QuestionVO();

  ret.parts = [
    generateValidTextPart(),
    generateValidImagePart(),
  ];

  return ret;
};

export const generateValidQuestionVO = generateValidTextQuestionVO as ()=> QuestionVO;

export const generateInvalidTextQuestionVO = () => {
  const ret = generateValidTextQuestionVO();

  ret.parts = [generateInvalidTextPart()];

  return ret;
};

export const generateInvalidQuestionVO = generateInvalidTextQuestionVO as ()=> QuestionVO;
