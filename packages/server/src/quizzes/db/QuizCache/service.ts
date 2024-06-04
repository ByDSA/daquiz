/* eslint-disable no-invalid-this */
import { QuizEntity, QuizUpdateEntity } from "#shared/models/quizzes/Quiz";
import { assertDefined } from "#shared/utils/validation/asserts";
import { Injectable } from "@nestjs/common";
import { UpdateQuery } from "mongoose";
import { QuizDocument } from "../Quiz";
import { updateQueryToUpdateEntity } from "../Quiz/Quiz";
import { QuizCache, QuizCacheSchema, quizCacheDocToEntity } from "./QuizCache";
import { EventDBEmitter } from "#/events/EventDBEmitter";
import { CreateEventDB, DeleteEventDB, PatchEventDB } from "#/events/EventDB";

@Injectable()
export class DBService {
  constructor(
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    const thisService = this;

    // eslint-disable-next-line func-names
    QuizCacheSchema.post("findOneAndUpdate", function (_oldDoc, next) {
      const filters = this.getFilter();
      const updateQuery = this.getUpdate();

      assertDefined(updateQuery);

      const id: string = filters?._id?.toString();

      assertDefined(id);
      const event: PatchEventDB<QuizEntity, QuizUpdateEntity> = {
        id,
        updateEntity: updateQueryToUpdateEntity(updateQuery as UpdateQuery<QuizDocument>),
      };

      thisService.dbEventEmitter.emitPatch(QuizCache.name, event);

      next();
    } );

    // eslint-disable-next-line func-names
    QuizCacheSchema.post("deleteOne", function (obj, next) {
      const filters = this.getFilter();
      const id = filters?._id?.toString();

      console.log(obj);

      assertDefined(id);
      const event: DeleteEventDB<QuizEntity> = {
        id,
      };

      thisService.dbEventEmitter.emitDelete(QuizCache.name, event);

      next();
    } );

    // eslint-disable-next-line func-names
    QuizCacheSchema.post("save", function (newDoc, next) {
      const { id, ...valueObject } = quizCacheDocToEntity(newDoc);
      const event: CreateEventDB<QuizEntity> = {
        id,
        valueObject,
      };

      thisService.dbEventEmitter.emitCreate(QuizCache.name, event);

      next();
    } );
  }
}
