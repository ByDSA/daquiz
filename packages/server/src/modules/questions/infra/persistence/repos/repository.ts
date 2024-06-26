import { assertDefined } from "#shared/utils/validation/asserts";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateOneQuestionDto, QuestionEntity, QuestionID, QuestionVO } from "../../../domain";
import { Repo } from "./repository.port";
import { docToEntity } from "./schemas/adapters";
import { Question } from "./schemas/schema";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";

@Injectable()
export class RepoImp implements Repo {
  constructor(
    @InjectModel(Question.name) private readonly QuestionModel: Model<Question>,
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    this.dbEventEmitter.registerEventDBLoggerFor(QuestionEntity);
  }

  async patchOneAndGet(id: string, props: QuestionVO): Promise<QuestionEntity | null> {
    const updateResult = await this.QuestionModel.updateOne( {
      _id: id,
    }, props).exec();

    if (updateResult.matchedCount !== 1)
      throw new NotFoundException("Failed to find question to update");

    if (updateResult.modifiedCount !== 1)
      return null;

    const found = await this.findOne(id);

    assertDefined(found, "Failed to find updated question");

    return found;
  }

  async createOneAndGet(dto: CreateOneQuestionDto): Promise<QuestionEntity> {
    let created = new this.QuestionModel(dto);

    created = await created.save();

    return docToEntity(created);
  }

  async findOne(id: QuestionID): Promise<QuestionEntity | null> {
    const doc = await this.QuestionModel.findById(id).exec();

    if (!doc)
      return null;

    return docToEntity(doc);
  }

  async findAll(): Promise<QuestionEntity[]> {
    const docs = await this.QuestionModel.find().exec();

    return docs.map(docToEntity);
  }
}
