import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionAnswer, documentToEntity } from "./db/schemas";
import { CreateQuestionAnswerDto } from "./dtos";
import { ID, QuestionAnswerEntity } from "./models";
import { AnswerID, AnswerType } from "#/answers/models";
import { UnknownAnswerVO } from "#/answers/models/unknown";
import { TextAnswersService } from "#/answers/text-answer/services";
import { QuestionID, QuestionType } from "#/questions/models";
import { UnknownQuestionVO } from "#/questions/models/unknown";
import { TextQuestionsService } from "#/questions/text-question/services";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";
import { neverCase } from "#/utils/typescript";

type FindOneOptions = Partial<{
  includeRelations: boolean;
}>;

@Injectable()
export class QuestionsAnswersService implements
CreateOneAndGetService<CreateQuestionAnswerDto, QuestionAnswerEntity>,
FindOneService<ID, QuestionAnswerEntity>,
FindAllService<QuestionAnswerEntity> {
  constructor(
    @InjectModel(QuestionAnswer.name) private readonly QuestionAnswerModel: Model<QuestionAnswer>,
    private readonly textQuestionsService: TextQuestionsService,
    private readonly textAnswersService: TextAnswersService,
  ) {}

  async createOneAndGet(dto: CreateQuestionAnswerDto): Promise<QuestionAnswerEntity> {
    let created = new this.QuestionAnswerModel(dto);

    created = await created.save();

    return documentToEntity(created);
  }

  async findOne(id: ID, options?: FindOneOptions): Promise<QuestionAnswerEntity | null> {
    const doc = await this.QuestionAnswerModel.findById(id).exec();

    if (!doc)
      return null;

    const entity = documentToEntity(doc);

    if (options?.includeRelations) {
      const questionService = this.#getQuestionServiceByType(entity.questionType);
      const questionPromise = questionService.findOne(entity.questionId);
      const answerService = this.#getAnswerServiceByType(entity.answerType);
      const answerPromise = answerService.findOne(entity.answerId);

      await Promise.all([questionPromise, answerPromise]);

      const question = await questionPromise;
      const answer = await answerPromise;

      if (question)
        entity.question = question;

      if (answer)
        entity.answer = answer;
    }

    return entity;
  }

  #getAnswerServiceByType(type: AnswerType): FindOneService<AnswerID, UnknownAnswerVO> {
    switch (type) {
      case AnswerType.TEXT:
        return this.textAnswersService;
      default:
        return neverCase(type);
    }
  }

  #getQuestionServiceByType(type: QuestionType): FindOneService<QuestionID, UnknownQuestionVO> {
    switch (type) {
      case QuestionType.TEXT:
        return this.textQuestionsService;
      default:
        return neverCase(type);
    }
  }

  async findAll(options?: FindOneOptions): Promise<QuestionAnswerEntity[]> {
    const docs = await this.QuestionAnswerModel.find().exec();

    return docs.map(documentToEntity);
  }
}
