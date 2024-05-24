import { QuestionAnswerEntity, QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { CreateQuestionAnswerDto } from "#shared/models/questions-answers/dtos";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionAnswer, populateAnswer, populateQuestion, questionAnswerDocumentToEntity } from "./db/schemas";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";
import { TextAnswersService } from "#/answers/text-answer/services";

type FindOneOptions = Partial<{
  includeRelations: {
    question?: boolean;
    answer?: boolean;
  };
}>;

@Injectable()
export class QuestionsAnswersService implements
CreateOneAndGetService<CreateQuestionAnswerDto, QuestionAnswerEntity>,
FindOneService<QuestionAnswerEntity>,
FindAllService<QuestionAnswerEntity> {
  constructor(
    @InjectModel(QuestionAnswer.name) private readonly QuestionAnswerModel: Model<QuestionAnswer>,
    private readonly textAnswersService: TextAnswersService,
  ) {}

  async createOneAndGet(dto: CreateQuestionAnswerDto): Promise<QuestionAnswerEntity> {
    let created = new this.QuestionAnswerModel(dto);

    created = await created.save();

    return questionAnswerDocumentToEntity(created);
  }

  async findOne(
    id: QuestionAnswerID,
    options?: FindOneOptions,
  ): Promise<QuestionAnswerEntity | null> {
    const doc = await this.QuestionAnswerModel.findById(id).exec();

    if (!doc)
      return null;

    const populatePromises: Promise<any>[] = [];

    if (options?.includeRelations?.question) {
      const p = populateQuestion(doc);

      populatePromises.push(p);
    }

    if (options?.includeRelations?.answer) {
      const p = populateAnswer(doc, doc.answerType);

      populatePromises.push(p);
    }

    await Promise.all(populatePromises);

    const entity = questionAnswerDocumentToEntity(doc);

    return entity;
  }

  async findAll(_options?: FindOneOptions): Promise<QuestionAnswerEntity[]> {
    const docs = await this.QuestionAnswerModel.find().exec();

    return docs.map(questionAnswerDocumentToEntity);
  }
}
