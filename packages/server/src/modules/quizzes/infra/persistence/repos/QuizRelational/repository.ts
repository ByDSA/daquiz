import { EventDBEmitter } from "#modules/events/EventDBEmitter";
import { QuestionAnswerID, QuestionAnswerRepo } from "#modules/question-answers";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AddQuestionsAnswersDto, CreateQuizDto, QuizEntity, QuizID } from "../../../../domain";
import { Repo, RepoFindOptions } from "./repository.port";
import { SchemaClass, docToEntity } from "./schemas";

@Injectable()
export class RepoImp implements Repo {
  constructor(
    @InjectModel(SchemaClass.name) private QuizModel: Model<SchemaClass>,
    @Inject(QuestionAnswerRepo)
    private readonly questionAnswerRepo: QuestionAnswerRepo,
    private readonly eventDBEmitter: EventDBEmitter,
  ) {
    this.eventDBEmitter.registerEventDBLoggerFor(QuizEntity);
  }

  async findOne(id: string, options?: RepoFindOptions): Promise<QuizEntity | null> {
    const doc = await this.QuizModel.findById(id).exec();

    if (!doc)
      return null;

    const entity = docToEntity(doc);

    if (options) {
      const promises: Promise<unknown>[] = [];

      if (options.include?.questionsAnswers)
        promises.push(this.#populateQuestionsAnswers(entity));

      if (options.include?.subquizzes)
        promises.push(this.#populateSubquizzes(entity));

      await Promise.all(promises);
    }

    return entity;
  }

  async findAll(options?: RepoFindOptions): Promise<QuizEntity[]> {
    const docs = await this.QuizModel.find().exec();

    if (!docs)
      throw new Error("Failed to find quizzes");

    const entities = docs.map(docToEntity);

    if (options) {
      const promises: Promise<unknown>[] = [];

      if (options.include?.questionsAnswers) {
        for (const entity of entities)
          promises.push(this.#populateQuestionsAnswers(entity));
      }

      if (options.include?.subquizzes) {
        for (const entity of entities)
          promises.push(this.#populateSubquizzes(entity));
      }

      await Promise.all(promises);
    }

    return entities;
  }

  #populateSubquizzes(entity: QuizEntity): Promise<unknown> {
    const promises: Promise<unknown>[] = [];
    const { subquizzes } = entity;

    if (subquizzes) {
      for (const subquiz of subquizzes) {
        const p = this.findOne(subquiz.id, {
          include: {
            questionsAnswers: true,
          },
        } );

        p.then((subquizEntity) => {
          if (subquizEntity)
            subquiz.quiz = subquizEntity;
        } );

        promises.push(p);
      }
    }

    return Promise.all(promises);
  }

  #populateQuestionsAnswers(entity: QuizEntity): Promise<unknown> {
    const promises: Promise<void>[] = [];

    entity.questionAnswers = [];

    for (const questionAnswerId of entity.questionAnswersIds) {
      const p = this.questionAnswerRepo.findOne(questionAnswerId).then((questionAnswer) => {
        if (questionAnswer)
          entity.questionAnswers?.push(questionAnswer);
      } );

      promises.push(p);
    }

    return Promise.all(promises);
  }

  async createOneAndGet(dto: CreateQuizDto): Promise<QuizEntity> {
    const doc = new this.QuizModel(dto);
    const createdDoc = await doc.save();

    if (!createdDoc)
      throw new Error("Failed to create quiz");

    const entity = docToEntity(createdDoc);

    return entity;
  }

  async addManyQuestionsAnswers(id: QuizID, dto: AddQuestionsAnswersDto): Promise<void> {
    const doc = await this.QuizModel.findByIdAndUpdate(id, {
      $addToSet: {
        questionsAnswersIds: {
          $each: dto.questionsAnswersIds,
        },
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to add questions answers");
  }

  async removeOneQuestionAnswer(
    id: QuizID,
    questionAnswerId: QuestionAnswerID,
  ): Promise<void> {
    const doc = await this.QuizModel.findByIdAndUpdate(id, {
      $pull: {
        questionsAnswersIds: questionAnswerId,
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to remove question answer");
  }

  async removeManyQuestionsAnswers(
    id: QuizID,
    questionAnswerIds: QuestionAnswerID[],
  ): Promise<void> {
    const doc = await this.QuizModel.findByIdAndUpdate(id, {
      $pull: {
        questionsAnswersIds: {
          $in: questionAnswerIds,
        },
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to remove question answer");
  }
}
