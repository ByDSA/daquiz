import { Injectable } from "@nestjs/common";
import { QuestionEntity } from "../domain";
import { documentToEntity, partialDocumentToPartialEntity } from "./adapters";
import { QuestionSchema } from "./schema";
import { registerEventEmitterPlugin } from "#/utils/db/mongoose/EventEmitterPlugin";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class QuestionDBService {
  constructor(private readonly dbEventEmitter: EventDBEmitter) {
    registerEventEmitterPlugin(QuestionSchema, {
      dbEventEmitter: dbEventEmitter,
      typeEventName: QuestionEntity.name,
      documentToEntity,
      patchEmission: {
        use: true,
        updateQueryToUpdateEntity: (updateQuery) => {
          const { $set } = updateQuery;
          const ret = partialDocumentToPartialEntity($set as any);

          return ret;
        },
      },
      createEmission: {
        use: true,
      },
    } );
  }
}
