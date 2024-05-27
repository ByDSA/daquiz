/* eslint-disable no-invalid-this */
import { TextAnswerEntity as Entity } from "#shared/models/answers/text-answers/TextAnswer";
import { assertDefined } from "#shared/utils/validation/asserts";
import { Injectable } from "@nestjs/common";
import { UpdateQuery } from "mongoose";
import { partialDocumentToPartialEntity } from "./adapters";
import { DocumentOdm, SchemaOdm } from "./schema";
import { EventDBEmitter } from "#/events/EventDBEmitter";
import { PatchEventDB } from "#/events/EventDB";

@Injectable()
export class Service {
  constructor(private readonly dbEventEmitter: EventDBEmitter) {
    const thisService = this;

    // eslint-disable-next-line func-names
    SchemaOdm.post("updateOne", function (updateResult, next) {
      if (updateResult.modifiedCount > 0) {
        const filters = this.getFilter();
        const updateQuery = this.getUpdate();
        const { $set } = updateQuery as UpdateQuery<DocumentOdm>;

        assertDefined($set);

        // eslint-disable-next-line no-underscore-dangle
        const id: string = filters?._id?.toString();

        assertDefined(id);
        const event: PatchEventDB<Entity> = {
          id,
          partialValueObject: $set && partialDocumentToPartialEntity($set),
          updateResult,
        };

        thisService.dbEventEmitter.emitPatch(Entity, event);
      }

      next();
    } );
  }
}
