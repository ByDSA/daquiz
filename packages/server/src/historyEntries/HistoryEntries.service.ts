import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HistoryEntriesServicePort } from "./HistoryEntries.service.port";
import { HistoryEntry, historyEntryDocToEntity } from "./db";
import { CreateOneHistoryEntryDto, HistoryEntryEntity, HistoryEntryID as HistoryEntryEntityID } from "./domain";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class HistoryEntriesService implements HistoryEntriesServicePort {
  constructor(
    @InjectModel(HistoryEntry.name) private readonly QuestionModel: Model<HistoryEntry>,
    private readonly eventDBEmitter: EventDBEmitter,
  ) {
    this.eventDBEmitter.registerEventDBLoggerFor(HistoryEntryEntity);
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
