import { QuestionAnswerEntity, QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity } from "#shared/models/questions/Question";
import { QuestionAnswerInQuizEntity, questionAnswerEntityToQuestionAnswerInQuizEntity } from "#shared/models/quizzes/QuestionAnswerInQuiz";
import { QuizEntity, QuizID } from "#shared/models/quizzes/Quiz";
import { ResultQuizPickQuestionsAnswersDto } from "#shared/models/quizzes/dtos";
import { assertDefined } from "#shared/utils/validation/asserts";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionAnswerCacheDocument, QuizCache, questionAnswerCacheEntityToDocument, quizCacheDocToEntity } from "../../db";
import { quizCacheEntityToDoc } from "../../db/QuizCache/QuizCache";
import { IReadService } from "./IReadService";
import { CreateManyService, CreateOneService, DeleteAllService, DeleteOneService } from "#/utils/services/crud";
import { QuestionsAnswersService } from "#/questions-answers/services";
import { HistoryEntriesService } from "#/historyEntries/services";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class QuizzesCacheRepository implements
IReadService,
CreateOneService<QuizEntity>,
CreateManyService<QuizEntity[]>,
DeleteOneService<QuizID>,
DeleteAllService {
  constructor(
    @InjectModel(QuizCache.name) private QuizCacheModel: Model<QuizCache>,
    private readonly dbEventEmitter: EventDBEmitter,
    private readonly historyEntriesService: HistoryEntriesService,
    private readonly questionsAnswersService: QuestionsAnswersService,
  ) {
    this.dbEventEmitter.onPatch<QuizEntity>(QuizCache.name, (event) => {
      console.log(QuizCache.name, "PATCH", event);
    } );

    this.dbEventEmitter.onDelete<QuizEntity>(QuizCache.name, (event) => {
      console.log(QuizCache.name, "DELETE", event);
    } );

    this.dbEventEmitter.onCreate<QuizEntity>(QuizCache.name, (event) => {
      console.log(QuizCache.name, "CREATE", event);
    } );
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
      const doc = questionAnswerCacheEntityToDocument(questionAnswerInQuizEntity);

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
      questionsAnswers: questionsAnswers.map(qa=> questionAnswerCacheEntityToDocument(qa)),
    } ).exec();

    return result;
  }

  async pickQuestionsAnswers(id: QuizID): Promise<ResultQuizPickQuestionsAnswersDto> {
    const gotQuiz = await this.findOne(id);
    const gotQuestionsAnswers = gotQuiz?.questionAnswers;

    assertDefined(gotQuestionsAnswers);

    if (gotQuestionsAnswers.length === 0)
      throw new BadRequestException("No questions answers");

    if (gotQuestionsAnswers.length > 1)
      this.#removeLastQuestionAnswerTried(gotQuestionsAnswers);

    const randomIndex = Math.floor(Math.random() * gotQuestionsAnswers.length);
    const retQuestionsAnswers: QuestionAnswerEntity[] = [];

    retQuestionsAnswers.push(gotQuestionsAnswers[randomIndex]);

    const pickedPartialQuestionAnswer = retQuestionsAnswers.map((qa) => {
      assertDefined(qa.question);

      const questionEntity: QuestionEntity = {
        id: qa.questionId,
        ...qa.question,
      };

      return {
        id: qa.id,
        question: questionEntity,
      };
    } );

    return {
      data: {
        pickedQuestions: pickedPartialQuestionAnswer,
      },
    };
  }

  async #removeLastQuestionAnswerTried(questionsAnswers: QuestionAnswerEntity[]) {
    const lastHistoryEntry = await this.historyEntriesService.findAll().then((historyEntries) => {
      return historyEntries.at(-1);
    } );
    const index = questionsAnswers.findIndex((qa) => {
      return qa.id === lastHistoryEntry?.questionAnswerId;
    } );

    if (index !== -1)
      questionsAnswers.splice(index, 1);
  }
}
