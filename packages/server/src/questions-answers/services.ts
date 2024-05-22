import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionAnswer, documentToEntity } from "./db/schemas";
import { CreateQuestionAnswerDto } from "./dtos";
import { QuestionAnswerEntity } from "./models";
import { AnswerID, AnswerType } from "#/answers/models";
import { UnknownAnswerVO } from "#/answers/models/unknown";
import { TextAnswersService } from "#/answers/text-answer/services";
import { QuestionID, QuestionType } from "#/questions/models";
import { UnknownQuestionVO } from "#/questions/models/unknown";
import { TextQuestionsService } from "#/questions/text-question/services";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";
import { neverCase } from "#/utils/typescript";

type FindOneOptions = Partial<{
  includeRelations: {
    question?: boolean;
    answer?: boolean;
  };
}>;

@Injectable()
export class QuestionsAnswersService implements
CreateOneAndGetService<CreateQuestionAnswerDto, QuestionAnswerEntity>,
FindOneService<QuestionAnswerEntity["id"], QuestionAnswerEntity>,
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

  async findOne(id: QuestionAnswerEntity["id"], options?: FindOneOptions): Promise<QuestionAnswerEntity | null> {
    const doc = await this.QuestionAnswerModel.findById(id).exec();

    if (!doc)
      return null;

    const entity = documentToEntity(doc);

    if (options?.includeRelations)
      await this.#addRelations(entity, options.includeRelations);

    return entity;
  }

  async #addRelations(entity: QuestionAnswerEntity, includeRelations: Required<FindOneOptions>["includeRelations"]): Promise<void> {
    const promises: Promise<unknown>[] = [];

    if (includeRelations.question) {
      const questionService = this.#getQuestionServiceByType(entity.questionType);
      const questionPromise = questionService.findOne(entity.questionId)
        .then((q) => {
          if (q)
            entity.question = q;
        } );

      promises.push(questionPromise);
    }

    if (includeRelations.answer) {
      const answerService = this.#getAnswerServiceByType(entity.answerType);
      const answerPromise = answerService.findOne(entity.answerId)
        .then((a) => {
          if (a)
            entity.answer = a;
        } );

      promises.push(answerPromise);
    }

    await Promise.all(promises);
  }

  async findOneByQuestionId(
    questionId: QuestionID,
    options?: FindOneOptions,
  ): Promise<QuestionAnswerEntity | null> {
    const doc = await this.QuestionAnswerModel.findOne( {
      questionId,
    } ).exec();

    if (!doc)
      return null;

    const entity = documentToEntity(doc);

    if (options?.includeRelations)
      await this.#addRelations(entity, options.includeRelations);

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
