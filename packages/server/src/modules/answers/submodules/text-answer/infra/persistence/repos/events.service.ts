import { Injectable } from "@nestjs/common";
import { TextAnswerEntity } from "../../../domain";
import { SchemaOdm } from "./schemas";
import { registerEventEmitterPlugin } from "#utils/db/mongoose/EventEmitterPlugin";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";

@Injectable()
export class EventsService {
  constructor(private readonly dbEventEmitter: EventDBEmitter) {
    registerEventEmitterPlugin(SchemaOdm, {
      dbEventEmitter: dbEventEmitter,
      typeEventName: TextAnswerEntity.name,
      patchEmission: {
        use: true,
      },
      createEmission: {
        use: true,
      },
    } );
  }
}
