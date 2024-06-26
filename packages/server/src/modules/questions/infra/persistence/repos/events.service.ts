import { Injectable } from "@nestjs/common";
import { QuestionEntity } from "../../../domain";
import { docToEntity, partialDocToPartialEntity } from "./schemas/adapters";
import { QuestionSchema } from "./schemas/schema";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";
import { registerEventEmitterPlugin } from "#/utils/db/mongoose/EventEmitterPlugin";

@Injectable()
export class EventsService {
  constructor(private readonly dbEventEmitter: EventDBEmitter) {
    registerEventEmitterPlugin(QuestionSchema, {
      dbEventEmitter: dbEventEmitter,
      typeEventName: QuestionEntity.name,
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
