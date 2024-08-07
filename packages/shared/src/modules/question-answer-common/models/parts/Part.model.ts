import { IsEnum } from "class-validator";

export enum PartType {
  Text = "text",
  Image = "image",
  Video = "video",
  Audio = "audio",
  Choices = "choices",
  Sets = "sets",
  Array = "array",
}

export abstract class Part {
  @IsEnum(PartType)
  type!: PartType;
}
