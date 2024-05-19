export type TextQuestionVO = {
  text: string;
};

export type ID = string;

export type TextQuestionEntity = TextQuestionVO & {
  id: ID;
};
