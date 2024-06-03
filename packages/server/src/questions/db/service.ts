/* eslint-disable no-invalid-this */
import { QuestionEntity } from "#shared/models/questions/Question";
import { assertDefined } from "#shared/utils/validation/asserts";
import { Injectable } from "@nestjs/common";
import { UpdateQuery } from "mongoose";
import { partialDocumentToPartialEntity } from "./adapters";
import { QuestionDocument, QuestionSchema } from "./schema";
import { EventDBEmitter } from "#/events/EventDBEmitter";
import { PatchEventDB } from "#/events/EventDB";

@Injectable()
export class QuestionDBService {
  constructor(private readonly dbEventEmitter: EventDBEmitter) {
    const thisService = this;

    // eslint-disable-next-line func-names
    QuestionSchema.post("updateOne", function (updateResult, next) {
      if (updateResult.modifiedCount > 0) {
        const filters = this.getFilter();
        const updateQuery = this.getUpdate();
        const { $set } = updateQuery as UpdateQuery<QuestionDocument>;

        assertDefined($set);

        const id: string = filters?._id?.toString();

        assertDefined(id);
        const event: PatchEventDB<QuestionEntity> = {
          id,
          partialValueObject: $set && partialDocumentToPartialEntity($set),
          updateResult,
        };

        thisService.dbEventEmitter.emitPatch(QuestionEntity, event);
      }

      next();
    } );
  }
}
