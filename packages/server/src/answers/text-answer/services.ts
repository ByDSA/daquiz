import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TextAnswer, textAnswerDocumentToEntity } from "./db";
import { CreateTextAnswerDto } from "./dtos";
import { ID, TextAnswerEntity } from "./models";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";

@Injectable()
export class TextAnswersService implements
CreateOneAndGetService<CreateTextAnswerDto, TextAnswerEntity>,
FindOneService<ID, TextAnswerEntity>,
FindAllService<TextAnswerEntity> {
  constructor(@InjectModel(TextAnswer.name) private TextQuestionModel: Model<TextAnswer>) {}

  async createOneAndGet(createtextQuestionDto: CreateTextAnswerDto): Promise<TextAnswerEntity> {
    const doc = new this.TextQuestionModel(createtextQuestionDto);
    const createdDoc = await doc.save();

    if (!createdDoc)
      throw new Error("Failed to create text answer");

    return textAnswerDocumentToEntity(createdDoc);
  }

  async findOne(id: string): Promise<TextAnswerEntity | null> {
    const doc = await this.TextQuestionModel.findById(id).exec();

    if (!doc)
      return null;

    return textAnswerDocumentToEntity(doc);
  }

  async findAll(): Promise<TextAnswerEntity[]> {
    const docs = await this.TextQuestionModel.find().exec();

    if (!docs)
      throw new Error("Failed to find text answers");

    return docs.map(textAnswerDocumentToEntity);
  }
}
