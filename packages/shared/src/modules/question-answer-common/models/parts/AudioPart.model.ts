import { MultimediaPart } from "./MultimediaPart.model";
import { PartType } from "./Part.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export class AudioPart extends MultimediaPart {
  @IsSpecificString(PartType.Audio)
  type!: PartType.Audio;
}
