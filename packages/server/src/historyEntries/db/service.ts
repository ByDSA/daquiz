import { Injectable } from "@nestjs/common";
import { HistoryEntryEntity } from "../domain";
import { docToEntity } from "./adapters";
import { SchemaDoc } from "./schema";
import { registerEventEmitterPlugin } from "#/utils/db/mongoose/EventEmitterPlugin";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class Service {
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
