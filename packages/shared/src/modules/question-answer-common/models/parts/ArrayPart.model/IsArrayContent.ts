import { ClassConstructor, Type } from "class-transformer";
import { IsArray, Validate, ValidateNested } from "class-validator";
import { AudioPart } from "../AudioPart.model";
import { ImagePart } from "../ImagePart.model";
import { Part, PartType } from "../Part.model";
import { TextPart } from "../TextPart.model";
import { VideoPart } from "../VideoPart.model";
import { IsValidArrayItemConstraint } from "./IsValidArrayItemConstraint";

type SubType = {
  value: ClassConstructor<Part>;
  name: PartType;
};

export const defaultSubTypes: readonly SubType[] = Object.freeze([
  {
    value: TextPart,
    name: PartType.Text,
  },
  {
    value: VideoPart,
    name: PartType.Video,
  },
  {
    value: AudioPart,
    name: PartType.Audio,
  },
  {
    value: ImagePart,
    name: PartType.Image,
  },
]);

type Props = {
  ignoreTypes?: PartType[];
  onlyTypes?: PartType[];
};
export function IsArrayPartContent(props?: Props) {
  let subTypes: SubType[];

  if (props?.onlyTypes)
    subTypes = defaultSubTypes.filter((obj) => props.onlyTypes?.includes(obj.name));
  else if (props?.ignoreTypes)
    subTypes = defaultSubTypes.filter((obj) => !props.ignoreTypes?.includes(obj.name));
  else
    subTypes = [...defaultSubTypes];

  const validPartTypes = subTypes.map(obj=>obj.name) as PartType[];

  return (target: any, propertyKey: string) => {
    IsArray()(target, propertyKey);
    Type(() => Part, {
      discriminator: {
        property: "type",
        subTypes,
      },
      keepDiscriminatorProperty: true,
    } )(target, propertyKey);
    ValidateNested( {
      each: true,
    } )(target, propertyKey);
    Validate(IsValidArrayItemConstraint, validPartTypes, {
      each: true,
    } )(target, propertyKey);
  };
}
