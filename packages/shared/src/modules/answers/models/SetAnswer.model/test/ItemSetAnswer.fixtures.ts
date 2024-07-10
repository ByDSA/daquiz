import { ItemSetAnswerType, ItemSetAnswerVO, TextSetItemVO } from "../ItemSetAnswer.model";

export const generateValidTextItemSetAnswerVO = () => {
  const ret = new TextSetItemVO();

  ret.type = ItemSetAnswerType.Text;
  ret.text = "Valid text";

  return ret;
};

// eslint-disable-next-line max-len
export const generateValidItemSetAnswerVO = generateValidTextItemSetAnswerVO as ()=> ItemSetAnswerVO;

export const generateInvalidTextItemSetAnswerVO = () => {
  const ret = generateValidTextItemSetAnswerVO();

  ret.text = 123 as any;

  return ret;
};

// eslint-disable-next-line max-len
export const generateInvalidItemSetAnswerVO = generateInvalidTextItemSetAnswerVO as ()=> ItemSetAnswerVO;
