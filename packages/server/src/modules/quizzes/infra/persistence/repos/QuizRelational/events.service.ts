import { Injectable } from "@nestjs/common";
import { QuizEntity } from "../../../../domain";
import { SchemaOdm as QuizSchema, docToEntity, updateQueryToUpdateEntity as quizUpdateQueryToUpdateEntity } from "./schemas";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";
import { registerEventEmitterPlugin } from "#/utils/db/mongoose/EventEmitterPlugin";

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
