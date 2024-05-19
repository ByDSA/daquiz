
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TextQuestion, documentToEntity } from "./db";
import { CreateTextQuestionDto } from "./dtos";
import { ID, TextQuestionEntity } from "./models";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";

@Injectable()
export class TextQuestionsService implements
CreateOneAndGetService<CreateTextQuestionDto, TextQuestionEntity>,
FindOneService<ID, TextQuestionEntity>,
FindAllService<TextQuestionEntity> {
  constructor(@InjectModel(TextQuestion.name) private TextQuestionModel: Model<TextQuestion>) {}

  async createOneAndGet(dto: CreateTextQuestionDto): Promise<TextQuestionEntity> {
    let created = new this.TextQuestionModel(dto);

    created = await created.save();

    return documentToEntity(created);
  }

  async findOne(id: ID): Promise<TextQuestionEntity | null> {
    const doc = await this.TextQuestionModel.findById(id).exec();

    if (!doc)
      return null;

    return documentToEntity(doc);
  }

  async findAll(): Promise<TextQuestionEntity[]> {
    const docs = await this.TextQuestionModel.find().exec();

    return docs.map(documentToEntity);
  }
}
