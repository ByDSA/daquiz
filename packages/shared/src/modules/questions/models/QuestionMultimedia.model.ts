import { IsOptional, IsString } from "class-validator";

export class QuestionMultimedia {
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
