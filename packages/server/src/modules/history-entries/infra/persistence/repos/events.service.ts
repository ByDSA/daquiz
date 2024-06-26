import { Injectable } from "@nestjs/common";
import { HistoryEntryEntity } from "../../../domain";
import { docToEntity } from "./schemas/adapters";
import { SchemaDoc } from "./schemas/schema";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";
import { registerEventEmitterPlugin } from "#/utils/db/mongoose/EventEmitterPlugin";

@Injectable()
export class EventsService {
  constructor(private readonly eventDbEmitter: EventDBEmitter) {
    registerEventEmitterPlugin(SchemaDoc, {
      dbEventEmitter: eventDbEmitter,
      documentToEntity: docToEntity,
      typeEventName: HistoryEntryEntity.name,
      createEmission: {
        use: true,
      },
    } );
  }
}
