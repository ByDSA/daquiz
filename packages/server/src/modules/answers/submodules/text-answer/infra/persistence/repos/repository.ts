import { QuestionAnswerID } from "#/modules/question-answers";
import { QuestionAnswer } from "#/modules/question-answers/infra/persistence/schema";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";
import { assertDefined } from "#shared/utils/validation/asserts";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateTextAnswerDto, PatchOneTextAnswerDto, TextAnswerEntity } from "../../../domain";
import { Repo } from "./repository.port";
import { SchemaClass, docToEntity } from "./schemas";

@Injectable()
export class RepoImp implements Repo {
  constructor(
    @InjectModel(SchemaClass.name) private TextAnswerModel: Model<SchemaClass>,
    @InjectModel(QuestionAnswer.name) private QuestionAnswerModel: Model<QuestionAnswer>,
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    this.dbEventEmitter.registerEventDBLoggerFor(TextAnswerEntity);
  }

  async patchOneAndGet(questionAnswerId: string, dto: PatchOneTextAnswerDto): Promise<TextAnswerEntity | null> {
    const partialDoc: Partial<TextAnswerEntity> = dto;
    const questionAnswerDoc = await this.QuestionAnswerModel.findById(questionAnswerId);

    assertDefined(questionAnswerDoc, "Failed to find question answer by id=" + questionAnswerId);
    const answerId = questionAnswerDoc.answerId.toString();
    const result = await this.TextAnswerModel.updateOne( {
      _id: answerId,
    }, partialDoc).exec();

    if (result.matchedCount !== 1)
      throw new NotFoundException("Failed to find text answer to update");

    if (result.modifiedCount !== 1)
      return null;

    const found = await this.findOneByInnerId(answerId);

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
    const answerId = await this.fetchAnswerId(id);

    return this.findOneByInnerId(answerId);
  }
  async findOneByInnerId(id: string): Promise<TextAnswerEntity | null> {
    const doc = await this.TextAnswerModel.findById(id).exec();

    if (!doc)
      return null;

    const ret = await docToEntity(doc);

    const questionAnswer = await this.QuestionAnswerModel.findOne({answerId: id});

    assertDefined(questionAnswer, "Failed to find questionAnswer by answerId");
    ret.id = questionAnswer.id;

    return ret;
  }

  private async fetchAnswerId(questionAnswerId: QuestionAnswerID): Promise<QuestionAnswerID> {
    const questionAnswerDoc = await this.QuestionAnswerModel.findById(questionAnswerId);
    const answerId = questionAnswerDoc?.answerId;

    assertDefined(answerId, "Failed to find answerId by questionAnswerId");

    return answerId.toString();
  }

  async findAll(): Promise<TextAnswerEntity[]> {
    const docs = await this.TextAnswerModel.find().exec();

    if (!docs)
      throw new Error("Failed to find text answers");

    return Promise.all(docs.map(docToEntity));
  }
}
