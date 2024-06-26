import { Injectable } from "@nestjs/common";
import { TextAnswerEntity } from "../../../domain";
import { SchemaOdm, docToEntity, partialDocToPartialEntity } from "./schemas";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";
import { registerEventEmitterPlugin } from "#/utils/db/mongoose/EventEmitterPlugin";

@Injectable()
export class EventsService {
  constructor(private readonly dbEventEmitter: EventDBEmitter) {
    registerEventEmitterPlugin(SchemaOdm, {
      dbEventEmitter: dbEventEmitter,
      typeEventName: TextAnswerEntity.name,
      documentToEntity: docToEntity,
      patchEmission: {
        use: true,
        updateQueryToUpdateEntity: (updateQuery) => {
          const { $set } = updateQuery;
          const ret = partialDocToPartialEntity($set as any);

          return ret;
        },
      },
      createEmission: {
        use: true,
      },
    } );
  }
}
