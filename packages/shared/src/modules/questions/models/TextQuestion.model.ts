import "reflect-metadata"; // Para evitar errores de que no encuentra Reflect.getMetadata cuando se importa en otros paquetes

import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { TextPart } from "./parts";
import { ArrayLength } from "#utils/validation/decorators/ArrayLength";

export class TextQuestionVO {
  @IsArray()
  @ArrayLength(1)
  @ValidateNested( {
    each: true,
  } )
  @Type(() => TextPart)
  parts!: [TextPart];
};
