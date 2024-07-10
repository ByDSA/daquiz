import { ImagePart } from "../ImagePart.model";
import { PartType } from "../Part.model";

export const generateValidImagePart = () => {
  const part = new ImagePart();

  part.type = PartType.Image;
  part.url = "https://example.com/image.jpg";
  part.caption = "Valid caption";

  return part;
};

export const generateInvalidImagePart = () => {
  const part = generateValidImagePart();

  part.url = undefined as any;

  return part;
};
