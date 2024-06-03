/* eslint-disable no-invalid-this */
import { QuizEntity, QuizUpdateEntity } from "#shared/models/quizzes/Quiz";
import { assertDefined } from "#shared/utils/validation/asserts";
import { Injectable } from "@nestjs/common";
import { UpdateQuery } from "mongoose";
import { Doc, SchemaOdm as QuizSchema, updateQueryToUpdateEntity } from "./Quiz";
import { EventDBEmitter } from "#/events/EventDBEmitter";
import { DeleteEventDB, PatchEventDB } from "#/events/EventDB";

@Injectable()
export class DBService {
  constructor(
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    const thisService = this;

    // eslint-disable-next-line func-names
    QuizSchema.post("findOneAndUpdate", function (_oldDoc, next) {
      const filters = this.getFilter();
      const updateQuery = this.getUpdate();

      assertDefined(updateQuery);

      const id: string = filters?._id?.toString();

      assertDefined(id);
      const event: PatchEventDB<QuizEntity, QuizUpdateEntity> = {
        id,
        updateEntity: updateQueryToUpdateEntity(updateQuery as UpdateQuery<Doc>),
      };

      thisService.dbEventEmitter.emitPatch(QuizEntity, event);

      next();
    } );

    // eslint-disable-next-line func-names
    QuizSchema.post("deleteOne", function (obj, next) {
      const filters = this.getFilter();
      const id = filters?._id?.toString();

      console.log(obj);

      assertDefined(id);
      const event: DeleteEventDB<QuizEntity> = {
        id,
      };

      thisService.dbEventEmitter.emitDelete(QuizEntity, event);

      next();
    } );
  }
}
