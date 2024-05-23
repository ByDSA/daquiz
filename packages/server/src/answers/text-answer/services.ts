import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TextAnswer, textAnswerDocumentToEntity } from "./db";
import { CreateTextAnswerDto } from "./dtos";
import { TextAnswerEntity } from "./models";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";

@Injectable()
export class TextAnswersService implements
CreateOneAndGetService<CreateTextAnswerDto, TextAnswerEntity>,
FindOneService<TextAnswerEntity>,
FindAllService<TextAnswerEntity> {
  constructor(@InjectModel(TextAnswer.name) private TextAnswerModel: Model<TextAnswer>) {}

  async createOneAndGet(dto: CreateTextAnswerDto): Promise<TextAnswerEntity> {
    const doc = new this.TextAnswerModel(dto);
    const createdDoc = await doc.save();

    if (!createdDoc)
      throw new Error("Failed to create text answer");

    return textAnswerDocumentToEntity(createdDoc);
  }

  async findOne(id: string): Promise<TextAnswerEntity | null> {
    const doc = await this.TextAnswerModel.findById(id).exec();

    if (!doc)
      return null;

    return textAnswerDocumentToEntity(doc);
  }

  async findAll(): Promise<TextAnswerEntity[]> {
    const docs = await this.TextAnswerModel.find().exec();

    if (!docs)
      throw new Error("Failed to find text answers");

    return docs.map(textAnswerDocumentToEntity);
  }
}
