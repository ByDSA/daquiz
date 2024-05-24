import { QuestionEntity, QuestionID } from "#shared/models/questions/Question";
import { CreateQuestionDto } from "#shared/models/questions/dtos";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Question, documentToEntity } from "./db";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";

@Injectable()
export class QuestionsService implements
CreateOneAndGetService<CreateQuestionDto, QuestionEntity>,
FindOneService<QuestionEntity>,
FindAllService<QuestionEntity> {
  constructor(@InjectModel(Question.name) private QuestionModel: Model<Question>) {}

  async createOneAndGet(dto: CreateQuestionDto): Promise<QuestionEntity> {
    let created = new this.QuestionModel(dto);

    created = await created.save();

    return documentToEntity(created);
  }

  async findOne(id: QuestionID): Promise<QuestionEntity | null> {
    const doc = await this.QuestionModel.findById(id).exec();

    if (!doc)
      return null;

    return documentToEntity(doc);
  }

  async findAll(): Promise<QuestionEntity[]> {
    const docs = await this.QuestionModel.find().exec();

    return docs.map(documentToEntity);
  }
}
