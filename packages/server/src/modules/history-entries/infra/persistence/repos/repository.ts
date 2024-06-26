import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateOneHistoryEntryDto, HistoryEntryEntity, HistoryEntryID as HistoryEntryEntityID } from "../../../domain";
import { Repo } from "./repository.port";
import { SchemaClass, docToEntity } from "./schemas";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";

@Injectable()
export class RepoImp implements Repo {
  constructor(
    @InjectModel(SchemaClass.name) private readonly QuestionModel: Model<SchemaClass>,
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

    return docToEntity(doc);
  }

  async findAll(): Promise<HistoryEntryEntity[]> {
    const docs = await this.QuestionModel.find().exec();

    return docs.map(docToEntity);
  }
}
