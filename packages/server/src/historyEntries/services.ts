import { HistoryEntryEntity, HistoryEntryID as HistoryEntryEntityID } from "#shared/models/history-entries/HistoryEntry";
import { CreateOneHistoryEntryDto } from "#shared/models/history-entries/dtos";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HistoryEntry, historyEntryDocToEntity } from "./db";
import { CreateOneService, FindAllService, FindOneService } from "#/utils/services/crud";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class HistoryEntriesService implements
CreateOneService<CreateOneHistoryEntryDto>,
FindOneService<HistoryEntryEntity>,
FindAllService<HistoryEntryEntity> {
  constructor(
    @InjectModel(HistoryEntry.name) private readonly QuestionModel: Model<HistoryEntry>,
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    this.dbEventEmitter.onPatch(HistoryEntryEntity, (event) => {
      console.log("LOG", `${HistoryEntryEntity.name} Patch Event`, event);
    } );
  }

  async createOne(dto: CreateOneHistoryEntryDto): Promise<void> {
    let created = new this.QuestionModel( {
      checkResult: dto.checkResult,
      date: new Date(),
      enteredAnswer: dto.enteredAnswer,
      questionAnswerId: dto.questionAnswerId,
    } );

    await created.save();
  }

  async findOne(id: HistoryEntryEntityID): Promise<HistoryEntryEntity | null> {
    const doc = await this.QuestionModel.findById(id).exec();

    if (!doc)
      return null;

    return historyEntryDocToEntity(doc);
  }

  async findAll(): Promise<HistoryEntryEntity[]> {
    const docs = await this.QuestionModel.find().exec();

    return docs.map(historyEntryDocToEntity);
  }
}
