import { AnswerVO } from "../Answer.model";
import { AnswerType } from "../AnswerType.enum";
import { TextAnswerVO } from "../TextAnswer.model";

export const generateValidTextAnswerVO = () => {
  const ret = new TextAnswerVO();

  ret.type = AnswerType.Text;
  ret.text = "This is a valid text answer.";

  return ret;
};

export const generateValidAnswerVO = generateValidTextAnswerVO as ()=> AnswerVO;

export const generateInvalidTextAnswerVO = () => {
  const ret = generateValidTextAnswerVO();

  ret.text = 123 as any;

  return ret;
};

export const generateInvalidAnswerVO = generateInvalidTextAnswerVO as ()=> AnswerVO;
