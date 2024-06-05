import { assertDefined } from "#shared/utils/validation/asserts";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateQuestionAnswerDto, QuestionAnswerEntity, QuestionAnswerID, QuestionsAnswersRepositoryFindOptions, QuestionsAnswersRepositoryPort } from "../../domain";
import { QuestionAnswer, QuestionAnswerDocument, questionAnswerDocumentToEntity } from "../db";
import { QuestionsServicePort } from "#/questions";
import { TextAnswersServicePort } from "#/answers/text-answer";

@Injectable()
export class QuestionsAnswersRepository implements QuestionsAnswersRepositoryPort {
  constructor(
    @InjectModel(QuestionAnswer.name) private readonly QuestionAnswerModel: Model<QuestionAnswer>,
    @Inject(QuestionsServicePort) private readonly questionsService: QuestionsServicePort,
    @Inject(TextAnswersServicePort) private readonly textAnswersService: TextAnswersServicePort,
  ) {}

  async createOneAndGet(dto: CreateQuestionAnswerDto): Promise<QuestionAnswerEntity> {
    let created = new this.QuestionAnswerModel(dto);

    created = await created.save();

    return questionAnswerDocumentToEntity(created);
  }

  async findOne(
    id: QuestionAnswerID,
    options?: QuestionsAnswersRepositoryFindOptions,
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

  async findAll(_options?: QuestionsAnswersRepositoryFindOptions): Promise<QuestionAnswerEntity[]> {
    const docs: QuestionAnswerDocument[] = await this.QuestionAnswerModel.find().exec();

    return docs.map(questionAnswerDocumentToEntity);
  }
}
