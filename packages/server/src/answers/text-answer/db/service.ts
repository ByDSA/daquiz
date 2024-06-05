import { Injectable } from "@nestjs/common";
import { TextAnswerEntity } from "../domain";
import { docToEntity, partialDocumentToPartialEntity } from "./adapters";
import { SchemaOdm as TextAnswerSchema } from "./schema";
import { registerEventEmitterPlugin } from "#/utils/db/mongoose/EventEmitterPlugin";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class Service {
  constructor(private readonly dbEventEmitter: EventDBEmitter) {
    registerEventEmitterPlugin(TextAnswerSchema, {
      dbEventEmitter: dbEventEmitter,
      typeEventName: TextAnswerEntity.name,
      documentToEntity: docToEntity,
      patchEmission: {
        use: true,
        updateQueryToUpdateEntity: (updateQuery) => {
          const { $set } = updateQuery;
          const ret = partialDocumentToPartialEntity($set as any);

          return ret;
        },
      },
    } );
  }
}
