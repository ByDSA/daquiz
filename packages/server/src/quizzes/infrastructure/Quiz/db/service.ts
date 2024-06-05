import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { Injectable } from "@nestjs/common";
import { SchemaOdm as QuizSchema, docToEntity, updateQueryToUpdateEntity as quizUpdateQueryToUpdateEntity } from "./Quiz";
import { registerEventEmitterPlugin } from "#/utils/db/mongoose/EventEmitterPlugin";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class DBService {
  constructor(
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    registerEventEmitterPlugin(QuizSchema, {
      dbEventEmitter,
      typeEventName: QuizEntity.name,
      documentToEntity: docToEntity,
      createEmission: {
        use: true,
      },
      patchEmission: {
        updateQueryToUpdateEntity: quizUpdateQueryToUpdateEntity,
        use: true,
      },
      deleteEmission: {
        use: true,
      },
    } );
  }
}
