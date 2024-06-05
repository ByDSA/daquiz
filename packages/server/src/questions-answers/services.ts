import { QuestionAnswerEntity, QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { CreateQuestionAnswerDto } from "#shared/models/questions-answers/dtos";
import { assertDefined } from "#shared/utils/validation/asserts";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionAnswer, QuestionAnswerDocument, questionAnswerDocumentToEntity } from "./db";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";
import { QuestionsService } from "#/questions/services";
import { TextAnswersService } from "#/answers/text-answer/services";

export type FindQuestionsAnswersOptions = Partial<{
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
    private readonly questionsService: QuestionsService,
    private readonly textAnswersService: TextAnswersService,
  ) {}

  async createOneAndGet(dto: CreateQuestionAnswerDto): Promise<QuestionAnswerEntity> {
    let created = new this.QuestionAnswerModel(dto);

    created = await created.save();

    return questionAnswerDocumentToEntity(created);
  }

  async findOne(
    id: QuestionAnswerID,
    options?: FindQuestionsAnswersOptions,
  ): Promise<QuestionAnswerEntity | null> {
    const doc = await this.QuestionAnswerModel.findById(id).exec();

    if (!doc)
      return null;

    const entity = questionAnswerDocumentToEntity(doc);
    // Population
    const populatePromises: Promise<any>[] = [];

    if (options?.includeRelations?.question) {
      const p = this.questionsService.findOne(entity.questionId)
        .then((got) => {
          assertDefined(got, "Question not found for id=" + entity.questionId);
          entity.question = got;
        } );

      populatePromises.push(p);
    }

    if (options?.includeRelations?.answer) {
      const p = this.textAnswersService.findOne(entity.answerId)
        .then((got) => {
          assertDefined(got, "Answer not found for id=" + entity.answerId);
          entity.answer = got;
        } );

      populatePromises.push(p);
    }

    await Promise.all(populatePromises);

    return entity;
  }

  async findAll(_options?: FindQuestionsAnswersOptions): Promise<QuestionAnswerEntity[]> {
    const docs: QuestionAnswerDocument[] = await this.QuestionAnswerModel.find().exec();

    return docs.map(questionAnswerDocumentToEntity);
  }
}
