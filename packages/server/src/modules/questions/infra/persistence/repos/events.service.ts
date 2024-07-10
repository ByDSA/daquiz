import { Injectable } from "@nestjs/common";
import { QuestionEntity } from "../../../domain";
import { QuestionSchema } from "./schemas/schema";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";
import { registerEventEmitterPlugin } from "#/utils/db/mongoose/EventEmitterPlugin";

@Injectable()
export class EventsService {
  constructor(private readonly dbEventEmitter: EventDBEmitter) {
    registerEventEmitterPlugin(QuestionSchema, {
      dbEventEmitter: dbEventEmitter,
      typeEventName: QuestionEntity.name,
      patchEmission: {
        use: true,
      },
      createEmission: {
        use: true,
      },
    } );
  }
}
