import { HistoryEntryEntity } from "#shared/models/history-entries/HistoryEntry";
import { QuestionEntity } from "#shared/models/questions/Question";
import { Injectable } from "@nestjs/common";
import { docToEntity } from "./adapters";
import { SchemaDoc } from "./schema";
import { EventDBEmitter } from "#/events/EventDBEmitter";
import { CreateEventDB } from "#/events/EventDB";

@Injectable()
export class Service {
  constructor(private readonly eventDbEmitter: EventDBEmitter) {
    const thisService = this;

    // eslint-disable-next-line func-names
    SchemaDoc.post("save", function (saved, next) {
      const { id, ...valueObject } = docToEntity(saved);
      const event: CreateEventDB<HistoryEntryEntity> = {
        id: saved._id.toString(),
        valueObject,
      };

      thisService.eventDbEmitter.emitCreate(QuestionEntity, event);

      next();
    } );
  }
}
