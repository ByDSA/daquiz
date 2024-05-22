import { WithPartial } from "#/utils/typescript";

type Multimedia = {
  text?: string;
  video?: {
    url: string;
  };
  image?: {
    url: string;
  };
  audio?: {
    url: string;
  };
};

type Choice = Multimedia & {
  value: string;
};

type Group = Multimedia & {
  choices: Choice[];
};

export type TextQuestionVO = WithPartial<Group, "choices"> & {
  groups?: Group[];
};

export type ID = string;

export type TextQuestionEntity = TextQuestionVO & {
  id: ID;
};
