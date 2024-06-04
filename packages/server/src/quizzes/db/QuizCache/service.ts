import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { Injectable } from "@nestjs/common";
import { updateQueryToUpdateEntity } from "../Quiz/Quiz";
import { QuizCache, QuizCacheDocument, QuizCacheSchema, quizCacheDocToEntity } from "./QuizCache";
import { EventEmitterPluginOptions, eventEmitterPlugin } from "#utils/db/mongoose/EventEmitterPlugin";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class DBService {
  constructor(
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    QuizCacheSchema.plugin(eventEmitterPlugin, {
      dbEventEmitter,
      typeEventName: QuizCache.name,
      documentToEntity: quizCacheDocToEntity,
      createEmission: {
        use: true,
      },
      patchEmission: {
        use: true,
        updateQueryToUpdateEntity,
      },
      deleteEmission: {
        use: true,
      },
    } as EventEmitterPluginOptions<QuizCacheDocument, QuizEntity>);
  }
}
