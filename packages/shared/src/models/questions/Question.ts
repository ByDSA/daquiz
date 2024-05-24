import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

class Multimedia {
  @IsString()
  @IsOptional()
  text?: string;

  @IsOptional()
  video?: {
    url: string;
  };

  @IsOptional()
  image?: {
    url: string;
  };

  @IsOptional()
  audio?: {
    url: string;
  };
};

class Choice extends Multimedia {
  @IsString()
  value!: string;
};

class Group extends Multimedia {
  @IsArray()
  @Type(() => Choice)
  choices!: Choice[];
};

export class QuestionVO extends Multimedia {
  @IsArray()
  @IsOptional()
  groups?: Group[];

  @IsArray()
  @IsOptional()
  @Type(() => Choice)
  choices?: Choice[];
};

export type QuestionID = string;

export class QuestionEntity extends QuestionVO {
  @IsString()
  id!: QuestionID;
};
