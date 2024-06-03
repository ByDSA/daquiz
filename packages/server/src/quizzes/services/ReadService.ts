import { AnswerType } from "#shared/models/answers/Answer";
import { TextAnswerEntity, TextAnswerID, TextAnswerVO } from "#shared/models/answers/text-answers/TextAnswer";
import { QuestionAnswerEntity, QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity, QuestionID, QuestionVO } from "#shared/models/questions/Question";
import { QuestionAnswerInQuizEntity, questionAnswerEntityToQuestionAnswerInQuizEntity } from "#shared/models/quizzes/QuestionAnswerInQuiz";
import { QuizEntity, QuizID, QuizUpdateEntity } from "#shared/models/quizzes/Quiz";
import { ResultQuizPickQuestionsAnswersDto } from "#shared/models/quizzes/dtos";
import { assertDefined } from "#shared/utils/validation/asserts";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import extend from "just-extend";
import { Model } from "mongoose";
import { QuestionAnswerCacheDocument, QuizCache, questionAnswerCacheEntityToDocument, quizCacheDocToEntity } from "../db";
import { FindAllService, FindOneService } from "#/utils/services/crud";
import { QuestionsAnswersService } from "#/questions-answers/services";
import { HistoryEntriesService } from "#/historyEntries/services";
import { EventDBEmitter } from "#/events/EventDBEmitter";
import { PatchEventDB } from "#/events/EventDB";

@Injectable()
export class QuizzesReadService implements
FindOneService<QuizEntity>,
FindAllService<QuizEntity> {
  constructor(
    @InjectModel(QuizCache.name) private QuizCacheModel: Model<QuizCache>,
    private readonly dbEventEmitter: EventDBEmitter,
    private readonly historyEntriesService: HistoryEntriesService,
    private readonly questionsAnswersService: QuestionsAnswersService,
  ) {
    this.dbEventEmitter.onPatch(
      QuestionEntity,
      (event) => {
        if (event.updateEntity)
          this.#patchQuestionReference(event.id, event.updateEntity);
      },
    );

    this.dbEventEmitter.onPatch(
      TextAnswerEntity,
      (event) => {
        if (event.updateEntity)
          this.#patchTextAnswerReference(event.id, event.updateEntity);
      },
    );

    this.dbEventEmitter.onPatch(
      QuizEntity,
      (event: PatchEventDB<QuizEntity, QuizUpdateEntity>) => {
        const addedQuestionsAnswersIds = event.updateEntity.questionAnswersIds?.added;

        if (addedQuestionsAnswersIds)
          this.#addQuestionsAnswers(event.id, addedQuestionsAnswersIds);

        const removedIds = event.updateEntity.questionAnswersIds?.removed;

        if (removedIds)
          this.#removeQuestionsAnswers(event.id, removedIds);
      },
    );
  }

  async #addQuestionsAnswers(id: QuizID, ids: QuestionAnswerID[]): Promise<void> {
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

  async #removeQuestionsAnswers(id: QuizID, ids: QuestionAnswerID[]): Promise<void> {
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

  async #patchQuestionReference(id: QuestionID, partialVO: Partial<QuestionVO>) {
    const quizzes = await this.findAll();

    for (const quiz of quizzes) {
      quiz.questionAnswers ??= [];
      let haveToUpdateQuiz = false;

      for (const questionAnswer of quiz.questionAnswers) {
        if (questionAnswer.questionId === id && questionAnswer.question) {
          questionAnswer.question = extend(
            {},
            questionAnswer.question,
            partialVO,
          ) as QuestionVO;
          questionAnswer.questionId = id;
          haveToUpdateQuiz = true;
        }
      }

      if (haveToUpdateQuiz)
        await this.#updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  async #patchTextAnswerReference(id: TextAnswerID, valueObject: Partial<TextAnswerVO>) {
    const quizzes = await this.findAll();

    for (const quiz of quizzes) {
      quiz.questionAnswers ??= [];
      let haveToUpdateQuiz = false;

      for (const questionAnswer of quiz.questionAnswers) {
        if (questionAnswer.answerType === AnswerType.TEXT
          && questionAnswer.answerId === id
          && questionAnswer.answer) {
          questionAnswer.answer = extend(
            true,
            {},
            questionAnswer.answer,
            valueObject,
          ) as TextAnswerVO;
          questionAnswer.answerId = id;
          haveToUpdateQuiz = true;
        }
      }

      if (haveToUpdateQuiz)
        await this.#updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  async #updateOneQuestionsAnswers(id: QuizID, questionsAnswers: QuestionAnswerInQuizEntity[]) {
    const result = await this.QuizCacheModel.updateOne( {
      _id: id,
    }, {
      questionsAnswers: questionsAnswers.map(qa=> questionAnswerCacheEntityToDocument(qa)),
    } ).exec();

    return result;
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
