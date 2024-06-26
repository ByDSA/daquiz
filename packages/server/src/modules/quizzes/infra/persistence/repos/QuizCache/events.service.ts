import { Injectable } from "@nestjs/common";
import { QuizEntity } from "../../../../domain";
import { updateQueryToUpdateEntity } from "../QuizRelational/schemas";
import { QuizCache, QuizCacheDocument, QuizCacheSchema, quizCacheDocToEntity } from "./QuizCache.schema";
import { EventEmitterPluginOptions, eventEmitterPlugin } from "#utils/db/mongoose/EventEmitterPlugin";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";

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
