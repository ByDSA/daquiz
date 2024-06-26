import { QuestionEntity } from "../../../../domain";
import { Audio, Image, Multimedia, Video } from "./multimedia.schema";

type MultimediaInQuestion = NonNullable<QuestionEntity["choices"]>[0];
type TextInQuestion = NonNullable<MultimediaInQuestion["text"]>;
type ImageInQuestion = NonNullable<MultimediaInQuestion["image"]>;
type VideoInQuestion = NonNullable<MultimediaInQuestion["video"]>;
type AudioInQuestion = NonNullable<MultimediaInQuestion["audio"]>;

const videoDocToEntity = (doc: Video): VideoInQuestion => {
  const { url } = doc;
  const entity: VideoInQuestion = {
    url,
  };

  return entity;
};
const imageDocToEntity = (doc: Image): ImageInQuestion => {
  const { url } = doc;
  const entity: ImageInQuestion = {
    url,
  };

  return entity;
};
const audioDocToEntity = (doc: Audio): AudioInQuestion => {
  const { url } = doc;
  const entity: AudioInQuestion = {
    url,
  };

  return entity;
};
const textDocToEntity = (doc: string): TextInQuestion => {
  return doc;
};

export const multimediaDocToEntity = (doc: Multimedia): MultimediaInQuestion => {
  const entity: MultimediaInQuestion = {};

  if (doc.text)
    entity.text = textDocToEntity(doc.text);

  if (doc.image)
    entity.image = imageDocToEntity(doc.image);

  if (doc.audio)
    entity.audio = audioDocToEntity(doc.audio);

  if (doc.video)
    entity.video = videoDocToEntity(doc.video);

  return entity;
};

export const multimediaEntityToDoc = (entity: MultimediaInQuestion): Multimedia => {
  const doc: Multimedia = {};

  if (entity.text)
    doc.text = entity.text;

  if (entity.image)
    doc.image = entity.image;

  if (entity.audio)
    doc.audio = entity.audio;

  if (entity.video)
    doc.video = entity.video;

  return doc;
};
