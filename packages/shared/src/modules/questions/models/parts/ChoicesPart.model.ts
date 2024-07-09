import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsOptional, Validate, ValidateNested, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { AudioPart } from "./AudioPart.model";
import { ImagePart } from "./ImagePart.model";
import { Part, PartType } from "./Part.model";
import { TextPart } from "./TextPart.model";
import { VideoPart } from "./VideoPart.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export type Pick = number | "multiple" | {
  min: number;
  max?: number;
};

export type Choice = AudioPart | ImagePart | TextPart | VideoPart;

// eslint-disable-next-line custom/no-blank-lines-after-decorator
@ValidatorConstraint( {
  name: "IsValidPick",
  async: false,
} )
class IsValidPickConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    if (typeof value === "number" && value > 0)
      return true;

    if (value === "multiple")
      return true;

    if (typeof value === "object" && value !== null) {
      const { min, max } = value;

      return typeof min === "number" && (typeof max === "undefined" || (typeof max === "number" && min <= max));
    }

    return false;
  }

  defaultMessage(_args: ValidationArguments) {
    return "pick must be a number, \"multiple\", or an object with numerical \"min\" and \"max\" where min <= max";
  }
}

// eslint-disable-next-line custom/no-blank-lines-after-decorator
@ValidatorConstraint( {
  name: "IsValidChoiceType",
  async: false,
} )
class IsValidChoiceTypeConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    const validTypes = [PartType.Text, PartType.Video, PartType.Audio, PartType.Image];

    return validTypes.includes(value?.type);
  }

  defaultMessage(_args: ValidationArguments) {
    return `Each choice must be a valid type: ${PartType.Text}, ${PartType.Video}, ${PartType.Audio}, ${PartType.Image}`;
  }
}

export class ChoicesPart extends Part {
  @IsSpecificString(PartType.Choices)
  type!: PartType.Choices;

  @IsOptional()
  @Validate(IsValidPickConstraint)
  pick?: Pick;

  @IsArray()
  @Type(() => Part, {
    discriminator: {
      property: "type",
      subTypes: [
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
      ],
    },
    keepDiscriminatorProperty: true,
  } )
  @ArrayMinSize(1)
  @ValidateNested( {
    each: true,
  } )
  @Validate(IsValidChoiceTypeConstraint, {
    each: true,
  } )
  choices!: Choice[];
}
