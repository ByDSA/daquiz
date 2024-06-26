import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import extend from "just-extend";
import { QuizEntity, QuizUpdateEntity } from "../../../domain";
import { QuizCacheRepo } from "../repos/QuizCache";
import { QuizRelationalRepo } from "../repos/QuizRelational";
import { GenerateQuizzesCacheService } from "./GenerateQuizzesCache.service.port";
import { QuestionEntity, QuestionVO } from "#modules/questions/domain";
import { OnCreateEvent, OnDeleteEvent, OnPatchEvent } from "#modules/events/EventDBEmitter";
import { CreateEventDB, DeleteEventDB, PatchEventDB } from "#modules/events/EventDB";
import { AnswerType } from "#modules/answers/domain";
import { TextAnswerEntity, TextAnswerVO } from "#/modules/answers/submodules/text-answer/domain";

@Injectable()
export class GenerateQuizzesCacheServiceImp implements GenerateQuizzesCacheService {
  private readonly logger: LoggerService = new Logger(this.constructor.name);

  constructor(
    @Inject(QuizRelationalRepo)
    private readonly quizRelationalRepo: QuizRelationalRepo,
    @Inject(QuizCacheRepo)
    private readonly quizCacheRepo: QuizCacheRepo,
  ) {
    this.generateCache();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.generateCache();
  }

  async generateCache() {
    this.logger.log("Quizzes cache updating");
    const quizzes = await this.quizRelationalRepo.findAll( {
      include: {
        questionsAnswers: {
          question: true,
          answer: true,
        },
      },
    } );

    await this.quizCacheRepo.deleteAll();
    await this.quizCacheRepo.createMany(quizzes);
    this.logger.log("Quizzes cache updated");
  }

  @OnPatchEvent(QuestionEntity)
  async handleOnPatchQuestion(event: PatchEventDB<QuestionEntity, QuestionVO>) {
    if (!event.updateEntity)
      return;

    const { id, updateEntity } = event;
    const quizzes = await this.quizCacheRepo.findAll();

    for (const quiz of quizzes) {
      quiz.questionAnswers ??= [];
      let haveToUpdateQuiz = false;

      for (const questionAnswer of quiz.questionAnswers) {
        if (questionAnswer.questionId === id && questionAnswer.question) {
          questionAnswer.question = extend(
            {},
            questionAnswer.question,
            updateEntity,
          ) as QuestionVO;
          questionAnswer.questionId = id;
          haveToUpdateQuiz = true;
        }
      }

      if (haveToUpdateQuiz)
        await this.quizCacheRepo.updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  @OnPatchEvent(TextAnswerEntity)
  async handleOnPatchTextAnswer(event: PatchEventDB<TextAnswerEntity>) {
    if (!event.updateEntity)
      return;

    const { id, updateEntity } = event;
    const quizzes = await this.quizCacheRepo.findAll();

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
            updateEntity,
          ) as TextAnswerVO;
          questionAnswer.answerId = id;
          haveToUpdateQuiz = true;
        }
      }

      if (haveToUpdateQuiz)
        await this.quizCacheRepo.updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  @OnPatchEvent(QuizEntity)
  async handleOnPatchQuiz(event: PatchEventDB<QuizEntity, QuizUpdateEntity>) {
    const addedQuestionsAnswersIds = event.updateEntity.questionAnswersIds?.added;

    if (addedQuestionsAnswersIds)
      await this.quizCacheRepo.addQuestionsAnswers(event.id, addedQuestionsAnswersIds);

    const removedIds = event.updateEntity.questionAnswersIds?.removed;

    if (removedIds)
      await this.quizCacheRepo.removeQuestionsAnswers(event.id, removedIds);
  }

  @OnCreateEvent(QuizEntity)
  handleOnCreateQuiz(event: CreateEventDB<QuizEntity>) {
    return this.quizCacheRepo.createOne( {
      id: event.id,
      ...event.valueObject,
    } );
  }

  @OnDeleteEvent(QuizEntity)
  handleOnDeleteQuiz(event: DeleteEventDB<QuizEntity>) {
    return this.quizCacheRepo.deleteOne(event.id);
  }
}
