import { QuestionAnswerVO } from "../QuestionAnswer.model";
import { generateInvalidAnswerVO, generateValidAnswerVO } from "#modules/answers/models/tests/fixtures";
import { generateInvalidQuestionVO, generateValidQuestionVO } from "#modules/questions/models/tests/fixtures";

export const generateValidQuestionAnswerVO = () => {
  const ret = new QuestionAnswerVO();

  ret.question = generateValidQuestionVO();
  ret.answer = generateValidAnswerVO();

  return ret;
};

export const generateInvalidQuestionAnswerVO = () => {
  const ret = new QuestionAnswerVO();

  ret.question = generateInvalidQuestionVO();
  ret.answer = generateInvalidAnswerVO();

  return ret;
};
