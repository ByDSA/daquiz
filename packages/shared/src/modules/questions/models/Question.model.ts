import { ArrayMinSize, IsArray, IsString, ValidateNested } from "class-validator";

import "reflect-metadata"; // Para evitar errores de que no encuentra Reflect.getMetadata cuando se importa en otros paquetes
import { IsPart } from "./parts/IsPart";
import { Part } from "./parts/Part.model";

export class QuestionVO {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested( {
    each: true,
  } )
  @IsPart( {
    each: true,
  } )
  parts!: Part[];
};

/**
 * @deprecated
 */
export class QuestionEntity extends QuestionVO {
  @IsString()
  id!: string;
}
