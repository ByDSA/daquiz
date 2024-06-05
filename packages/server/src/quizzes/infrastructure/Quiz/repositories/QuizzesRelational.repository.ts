import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuizEntity, QuizID } from "#shared/models/quizzes/Quiz";
import { AddQuestionsAnswersDto, CreateQuizDto } from "#shared/models/quizzes/dtos";
import { assertDefined } from "#shared/utils/validation/asserts";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Quiz, quizDocToEntity } from "../db";
import { QuizzesRelationalRepositoryFindOptions, QuizzesRelationalRepositoryPort } from "#/quizzes/domain/ports/repositories/QuizzesRelational.repository.port";
import { QuestionsAnswersService } from "#/questions-answers/services";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class QuizzesRelationalRepository implements QuizzesRelationalRepositoryPort {
  constructor(
    @InjectModel(Quiz.name) private QuizModel: Model<Quiz>,
    private readonly questionsAnswersService: QuestionsAnswersService,
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    this.dbEventEmitter.onPatch(QuizEntity, (event) => {
      console.log(QuizEntity.name, "PATCH", event);
    } );

    this.dbEventEmitter.onDelete(QuizEntity, (event) => {
      console.log(QuizEntity.name, "DELETE", event);
    } );

    this.dbEventEmitter.onCreate(QuizEntity, (event) => {
      console.log(QuizEntity.name, "CREATE", event);
    } );
  }

  async findAll(options?: QuizzesRelationalRepositoryFindOptions): Promise<QuizEntity[]> {
    const docs = await this.QuizModel.find().exec();

    if (!docs)
      throw new Error("Failed to find quizzes");

    const entities = docs.map(quizDocToEntity);
    const promises: Promise<unknown>[] = [];

    if (options) {
      if (options.include.questionsAnswers) {
        for (const entity of entities) {
          entity.questionAnswers = [];

          for (const questionAnswerId of entity.questionAnswersIds) {
            const p = this.questionsAnswersService.findOne(questionAnswerId, {
              includeRelations: options.include.questionsAnswers,
            } );

            p.then((questionAnswer) => {
              if (questionAnswer) {
                assertDefined(questionAnswer.question);
                assertDefined(questionAnswer.answer);
                entity.questionAnswers?.push( {
                  id: questionAnswer.id,
                  answerType: questionAnswer.answerType,
                  answerId: questionAnswer.answerId,
                  answer: questionAnswer.answer,
                  questionId: questionAnswer.questionId,
                  question: questionAnswer.question,
                } );
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

    const entity = quizDocToEntity(createdDoc);

    return entity;
  }

  async addManyQuestionsAnswers(id: QuizID, dto: AddQuestionsAnswersDto): Promise<void> {
    const doc = await this.QuizModel.findByIdAndUpdate(id, {
      $addToSet: {
        questionsAnswers: {
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
        questionsAnswers: questionAnswerId,
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
        questionsAnswers: {
          $in: questionAnswerIds,
        },
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to remove question answer");
  }
}
