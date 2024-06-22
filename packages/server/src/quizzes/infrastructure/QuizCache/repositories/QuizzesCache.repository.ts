import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionAnswerInQuizEntity, QuizEntity, QuizID, questionAnswerEntityToQuestionAnswerInQuizEntity } from "../../../domain";
import { QuestionAnswerCacheDocument, QuizCache, questionAnswerCacheEntityToDoc, quizCacheDocToEntity } from "../db";
import { quizCacheEntityToDoc } from "../db/QuizCache";
import { QuizzesCacheRepositoryPort } from "#/quizzes/domain/ports/repositories/QuizzesCache.repository.port";
import { QuestionAnswerID, QuestionsAnswersRepositoryPort } from "#/questions-answers/domain";
import { HistoryEntriesServicePort } from "#/historyEntries";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class QuizzesCacheRepository implements QuizzesCacheRepositoryPort {
  constructor(
    @InjectModel(QuizCache.name) private QuizCacheModel: Model<QuizCache>,
    private readonly dbEventEmitter: EventDBEmitter,
    @Inject(HistoryEntriesServicePort)
    private readonly historyEntriesService: HistoryEntriesServicePort,
    @Inject(QuestionsAnswersRepositoryPort)
    private readonly questionsAnswersService: QuestionsAnswersRepositoryPort,
  ) {
    this.dbEventEmitter.registerEventDBLoggerFor(QuizCache.name);
  }

  async deleteAll(): Promise<void> {
    await this.QuizCacheModel.deleteMany().exec();
  }

  async createMany(dto: QuizEntity[]): Promise<void> {
    const docs = dto.map(quizCacheEntityToDoc);

    await this.QuizCacheModel.insertMany(docs);
  }

  async createOne(entity: QuizEntity): Promise<void> {
    const doc = quizCacheEntityToDoc(entity);

    await this.QuizCacheModel.create(doc);
  }

  async deleteOne(id: QuizID): Promise<void> {
    await this.QuizCacheModel.deleteOne( {
      _id: id,
    } );
  }

  async findOne(id: string): Promise<QuizEntity | null> {
    const doc = await this.QuizCacheModel.findById(id).exec();

    if (!doc)
      return null;

    return quizCacheDocToEntity(doc);
  }

  async findAll(): Promise<QuizEntity[]> {
    const docs = await this.QuizCacheModel.find().exec();

    if (!docs)
      throw new Error("Failed to find quizzes");

    return docs.map(quizCacheDocToEntity);
  }

  async removeQuestionsAnswers(id: QuizID, ids: QuestionAnswerID[]): Promise<void> {
    const doc = await this.QuizCacheModel.findByIdAndUpdate(id, {
      $pull: {
        questionsAnswers: {
          _id: {
            $in: ids,
          },
        },
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to add questions answers");
  }

  async addQuestionsAnswers(id: QuizID, ids: QuestionAnswerID[]): Promise<void> {
    const questionsAnswersDocs: QuestionAnswerCacheDocument[] = [];

    for (const questionAnswerId of ids) {
      const questionAnswerEntity = await this.questionsAnswersService.findOne(questionAnswerId, {
        includeRelations: {
          question: true,
          answer: true,
        },
      } );

      if (!questionAnswerEntity)
        throw new BadRequestException("Failed to find question answer");

      const questionAnswerInQuizEntity = questionAnswerEntityToQuestionAnswerInQuizEntity(
        questionAnswerEntity,
      );
      const doc = questionAnswerCacheEntityToDoc(questionAnswerInQuizEntity);

      questionsAnswersDocs.push(doc);
    }

    const doc = await this.QuizCacheModel.findByIdAndUpdate(id, {
      $addToSet: {
        questionsAnswers: {
          $each: questionsAnswersDocs,
        },
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to add questions answers");
  }

  async updateOneQuestionsAnswers(id: QuizID, questionsAnswers: QuestionAnswerInQuizEntity[]) {
    const result = await this.QuizCacheModel.updateOne( {
      _id: id,
    }, {
      questionsAnswers: questionsAnswers.map(qa=> questionAnswerCacheEntityToDoc(qa)),
    } ).exec();

    return result;
  }
}
