import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateTextAnswerDto, PatchOneTextAnswerDto, TextAnswerEntity } from "../../../domain";
import { Repo } from "./repository.port";
import { SchemaClass, docToEntity } from "./schemas";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";

@Injectable()
export class RepoImp implements Repo {
  constructor(
    @InjectModel(SchemaClass.name) private TextAnswerModel: Model<SchemaClass>,
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    this.dbEventEmitter.registerEventDBLoggerFor(TextAnswerEntity);
  }

  async patchOneAndGet(id: string, dto: PatchOneTextAnswerDto): Promise<TextAnswerEntity | null> {
    const partialDoc: Partial<TextAnswerEntity> = dto;
    const result = await this.TextAnswerModel.updateOne( {
      _id: id,
    }, partialDoc).exec();

    if (result.matchedCount !== 1)
      throw new NotFoundException("Failed to find text answer to update");

    if (result.modifiedCount !== 1)
      return null;

    const found = await this.findOne(id);

    if (!found)
      throw new NotFoundException("Failed to find updated text answer");

    return found;
  }

  async createOneAndGet(dto: CreateTextAnswerDto): Promise<TextAnswerEntity> {
    const doc = new this.TextAnswerModel(dto);
    const createdDoc = await doc.save();

    if (!createdDoc)
      throw new Error("Failed to create text answer");

    return docToEntity(createdDoc);
  }

  async findOne(id: string): Promise<TextAnswerEntity | null> {
    const doc = await this.TextAnswerModel.findById(id).exec();

    if (!doc)
      return null;

    return docToEntity(doc);
  }

  async findAll(): Promise<TextAnswerEntity[]> {
    const docs = await this.TextAnswerModel.find().exec();

    if (!docs)
      throw new Error("Failed to find text answers");

    return docs.map(docToEntity);
  }
}
