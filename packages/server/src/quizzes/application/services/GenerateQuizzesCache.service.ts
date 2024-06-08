import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import extend from "just-extend";
import { GenerateQuizzesCacheServicePort, QuizEntity, QuizUpdateEntity, QuizzesCacheRepositoryPort, QuizzesRelationalRepositoryPort } from "../../domain";
import { AnswerType } from "#/answers/domain";
import { TextAnswerEntity, TextAnswerVO } from "#/answers/text-answer/domain";
import { CreateEventDB, DeleteEventDB, PatchEventDB } from "#/events/EventDB";
import { OnCreateEvent, OnDeleteEvent, OnPatchEvent } from "#/events/EventDBEmitter";
import { QuestionEntity, QuestionVO } from "#/questions/domain";

@Injectable()
export class GenerateQuizzesCacheService implements GenerateQuizzesCacheServicePort {
  private readonly logger: LoggerService = new Logger(this.constructor.name);

  constructor(
    @Inject(QuizzesRelationalRepositoryPort)
    private readonly quizzesRelationalRepo: QuizzesRelationalRepositoryPort,
    @Inject(QuizzesCacheRepositoryPort)
    private readonly quizzesCacheRepo: QuizzesCacheRepositoryPort,
  ) {
    this.generateCache();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.generateCache();
  }

  async generateCache() {
    this.logger.log("Quizzes cache updating");
    const quizzes = await this.quizzesRelationalRepo.findAll( {
      include: {
        questionsAnswers: {
          question: true,
          answer: true,
        },
      },
    } );

    await this.quizzesCacheRepo.deleteAll();
    await this.quizzesCacheRepo.createMany(quizzes);
    this.logger.log("Quizzes cache updated");
  }

  @OnPatchEvent(QuestionEntity)
  async handleOnPatchQuestion(event: PatchEventDB<QuestionEntity, QuestionVO>) {
    if (!event.updateEntity)
      return;

    const { id, updateEntity } = event;
    const quizzes = await this.quizzesCacheRepo.findAll();

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
        await this.quizzesCacheRepo.updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  @OnPatchEvent(TextAnswerEntity)
  async handleOnPatchTextAnswer(event: PatchEventDB<TextAnswerEntity>) {
    if (!event.updateEntity)
      return;

    const { id, updateEntity } = event;
    const quizzes = await this.quizzesCacheRepo.findAll();

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
        await this.quizzesCacheRepo.updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  @OnPatchEvent(QuizEntity)
  async handleOnPatchQuiz(event: PatchEventDB<QuizEntity, QuizUpdateEntity>) {
    const addedQuestionsAnswersIds = event.updateEntity.questionAnswersIds?.added;

    if (addedQuestionsAnswersIds)
      await this.quizzesCacheRepo.addQuestionsAnswers(event.id, addedQuestionsAnswersIds);

    const removedIds = event.updateEntity.questionAnswersIds?.removed;

    if (removedIds)
      await this.quizzesCacheRepo.removeQuestionsAnswers(event.id, removedIds);
  }

  @OnCreateEvent(QuizEntity)
  handleOnCreateQuiz(event: CreateEventDB<QuizEntity>) {
    return this.quizzesCacheRepo.createOne( {
      id: event.id,
      ...event.valueObject,
    } );
  }

  @OnDeleteEvent(QuizEntity)
  handleOnDeleteQuiz(event: DeleteEventDB<QuizEntity>) {
    return this.quizzesCacheRepo.deleteOne(event.id);
  }
}
