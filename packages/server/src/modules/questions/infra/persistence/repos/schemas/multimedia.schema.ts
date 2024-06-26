import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Video {
  @Prop( {
    type: String,
    required: true,
  } )
  url: string;
}

@Schema()
export class Audio {
  @Prop( {
    type: String,
    required: true,
  } )
  url: string;
}

@Schema()
export class Image {
  @Prop( {
    type: String,
    required: true,
  } )
  url: string;
}

@Schema()
export class Multimedia {
  @Prop( {
    type: String,
    required: false,
  } )
  text?: string;

  @Prop( {
    type: Video,
    required: false,
  } )
  video?: Video;

  @Prop( {
    type: Image,
    required: false,
  } )
  image?: Image;

  @Prop( {
    type: Audio,
    required: false,
  } )
  audio?: Audio;
}

@Schema()
export class Choice extends Multimedia {
}
