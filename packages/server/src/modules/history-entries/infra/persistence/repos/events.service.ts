import { Injectable } from "@nestjs/common";
import { HistoryEntryEntity } from "../../../domain";
import { SchemaDoc } from "./schemas/schema";
import { registerEventEmitterPlugin } from "#utils/db/mongoose/EventEmitterPlugin";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";

@Injectable()
export class EventsService {
  constructor(private readonly eventDbEmitter: EventDBEmitter) {
    registerEventEmitterPlugin(SchemaDoc, {
      dbEventEmitter: eventDbEmitter,
      typeEventName: HistoryEntryEntity.name,
      createEmission: {
        use: true,
      },
    } );
  }
}
