import { MultimediaPart } from "./MultimediaPart.model";
import { PartType } from "./Part.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export class VideoPart extends MultimediaPart {
  @IsSpecificString(PartType.Video)
  type!: PartType.Video;
}
