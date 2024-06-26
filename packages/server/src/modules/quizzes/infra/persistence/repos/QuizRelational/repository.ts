import { assertDefined } from "#shared/utils/validation/asserts";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AddQuestionsAnswersDto, CreateQuizDto, QuizEntity, QuizID } from "../../../../domain";
import { Repo, RepoFindOptions } from "./repository.port";
import { SchemaClass, docToEntity } from "./schemas";
import { QuestionAnswerID, QuestionAnswerRepo } from "#modules/questions-answers";
import { EventDBEmitter } from "#modules/events/EventDBEmitter";

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

  async findAll(options?: RepoFindOptions): Promise<QuizEntity[]> {
    const docs = await this.QuizModel.find().exec();

    if (!docs)
      throw new Error("Failed to find quizzes");

    const entities = docs.map(docToEntity);
    const promises: Promise<unknown>[] = [];

    if (options) {
      if (options.include.questionsAnswers) {
        for (const entity of entities) {
          entity.questionAnswers = [];

          for (const questionAnswerId of entity.questionAnswersIds) {
            const p = this.questionAnswerRepo.findOne(questionAnswerId, {
              includeRelations: options.include.questionsAnswers,
            } );

            p.then((questionAnswer) => {
              if (questionAnswer) {
                assertDefined(questionAnswer.question);
                assertDefined(questionAnswer.answer);
                const questionAnswerEntity = {
                  id: questionAnswer.id,
                  answerType: questionAnswer.answerType,
                  answerId: questionAnswer.answerId,
                  answer: questionAnswer.answer,
                  questionId: questionAnswer.questionId,
                  question: questionAnswer.question,
                };

                entity.questionAnswers?.push(questionAnswerEntity);
              }
            } );

            promises.push(p);
          }
        }
      }

      await Promise.all(promises);
    }

    return entities;
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