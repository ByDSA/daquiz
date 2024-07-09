import { QuestionAnswer } from "#/modules/question-answers/infra/persistence";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";
import { QuestionAnswerID } from "#modules/question-answers";
import { assertDefined } from "#shared/utils/validation/asserts";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateOneQuestionDto, PatchOneQuestionDto, QuestionEntity } from "../../../domain";
import { Repo } from "./repository.port";
import { docToEntity } from "./schemas/adapters";
import { Question } from "./schemas/schema";

@Injectable()
export class RepoImp implements Repo {
  constructor(
    @InjectModel(Question.name) private readonly QuestionModel: Model<Question>,
    @InjectModel(QuestionAnswer.name) private readonly QuestionAnswerModel: Model<QuestionAnswer>,
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    this.dbEventEmitter.registerEventDBLoggerFor(QuestionEntity);
  }

  async patchOneAndGet(
    id: QuestionAnswerID,
    dto: PatchOneQuestionDto,
  ): Promise<QuestionEntity | null> {
    const doc = dto;
    const questionId = await this.fetchQuestionId(id);
    const updateResult = await this.QuestionModel.updateOne( {
      _id: questionId,
    }, doc).exec();

    if (updateResult.matchedCount !== 1)
      throw new NotFoundException("Failed to find question to update");

    if (updateResult.modifiedCount !== 1)
      return null;

    const found = await this.findOne(id);

    assertDefined(found, "Failed to find updated question");

    return found;
  }

  private async fetchQuestionId(questionAnswerId: QuestionAnswerID): Promise<QuestionAnswerID> {
    const questionAnswerDoc = await this.QuestionAnswerModel.findById(questionAnswerId);
    const questionId = questionAnswerDoc?.questionId;

    assertDefined(questionId, "Failed to find questionId by questionAnswerId");

    return questionId.toString();
  }

  async createOneAndGet(dto: CreateOneQuestionDto): Promise<QuestionEntity> {
    let created = new this.QuestionModel(dto);

    created = await created.save();

    return docToEntity(created);
  }

  async findOne(id: string): Promise<QuestionEntity | null> {
    const questionId = await this.fetchQuestionId(id);

    return this.findOneByInnerId(questionId);
  }
  async findOneByInnerId(id: string): Promise<QuestionEntity | null> {
    const doc = await this.QuestionModel.findById(id).exec();

    if (!doc)
      return null;

    const ret = docToEntity(doc);

    const questionAnswer = await this.QuestionAnswerModel.findOne({questionId: id});

    assertDefined(questionAnswer, "Failed to find questionAnswer by questionId");
    ret.id = questionAnswer.id;

    return ret;
  }

  async findAll(): Promise<QuestionEntity[]> {
    const docs = await this.QuestionModel.find().exec();

    return docs.map(docToEntity);
  }
}
