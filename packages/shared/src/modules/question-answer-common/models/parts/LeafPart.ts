import { AudioPart } from "./AudioPart.model";
import { ImagePart } from "./ImagePart.model";
import { PartType } from "./Part.model";
import { TextPart } from "./TextPart.model";
import { VideoPart } from "./VideoPart.model";

export type LeafPart = AudioPart | ImagePart | TextPart | VideoPart;

export const LeafPartTypes = [
  PartType.Text,
  PartType.Audio,
  PartType.Video,
  PartType.Image,
];
