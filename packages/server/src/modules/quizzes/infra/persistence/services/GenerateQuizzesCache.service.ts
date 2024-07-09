import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { QuizEntity, QuizID, QuizUpdateEntity } from "../../../domain";
import { QuizCacheRepo } from "../repos/QuizCache";
import { quizDocToEntity, QuizDocument, QuizRelationalRepo } from "../repos/QuizRelational";
import { GenerateQuizzesCacheService } from "./GenerateQuizzesCache.service.port";
import { TextAnswerEntity, TextAnswerVO } from "#/modules/answers/submodules/text-answer/domain";
import { TextAnswer } from "#/modules/answers/submodules/text-answer/infra/persistence/repos/schemas/schema";
import { Question } from "#/modules/questions/infra/persistence/repos/schemas";
import { AnswerType } from "#modules/answers/domain";
import { CreateEventDB, DeleteEventDB, PatchEventDB } from "#modules/events/EventDB";
import { OnCreateEvent, OnDeleteEvent, OnPatchEvent } from "#modules/events/EventDBEmitter";
import { PartType, QuestionEntity, TextPart } from "#modules/questions/domain";

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
        questionsAnswers: true,
        subquizzes: true,
      },
    } );

    await this.quizCacheRepo.deleteAll();
    await this.quizCacheRepo.createMany(quizzes);
    this.logger.log("Quizzes cache updated");
  }

  @OnPatchEvent(QuestionEntity)
  async handleOnPatchQuestion(event: PatchEventDB<string, Question>) {
    if (!event.doc)
      return;

    const { id, updateDoc } = event;
    const quizzes = await this.quizCacheRepo.findAll();

    for (const quiz of quizzes) {
      quiz.questionAnswers ??= [];
      let haveToUpdateQuiz = false;

      for (const questionAnswer of quiz.questionAnswers) {
        if (questionAnswer.id === id) {
          if (updateDoc.text) {
            for (const part of questionAnswer.question.parts) {
              if (part.type === PartType.Text) {
                (part as TextPart).text = updateDoc.text;
                break;
              }
            }
          }

          haveToUpdateQuiz = true;
        }
      }

      if (haveToUpdateQuiz)
        await this.quizCacheRepo.updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  @OnPatchEvent(TextAnswerEntity)
  async handleOnPatchTextAnswer(event: PatchEventDB<string, TextAnswer>) {
    if (!event.updateDoc)
      return;

    const { id, updateDoc } = event;
    const quizzes = await this.quizCacheRepo.findAll();

    for (const quiz of quizzes) {
      quiz.questionAnswers ??= [];
      let haveToUpdateQuiz = false;

      for (const questionAnswer of quiz.questionAnswers) {
        if (
          questionAnswer.id === id
          && questionAnswer.answer.type === AnswerType.Text
          && updateDoc.text
        ) {
          (questionAnswer.answer as TextAnswerVO).text = updateDoc.text;

          haveToUpdateQuiz = true;
        }
      }

      if (haveToUpdateQuiz)
        await this.quizCacheRepo.updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  @OnPatchEvent(QuizEntity)
  async handleOnPatchQuiz(event: PatchEventDB<QuizID, QuizUpdateEntity>) {
    const addedQuestionsAnswersIds = event.updateDoc.questionAnswersIds?.added;

    if (addedQuestionsAnswersIds)
      await this.quizCacheRepo.addQuestionsAnswers(event.id, addedQuestionsAnswersIds);

    const removedIds = event.updateDoc.questionAnswersIds?.removed;

    if (removedIds)
      await this.quizCacheRepo.removeQuestionsAnswers(event.id, removedIds);
  }

  @OnCreateEvent(QuizEntity)
  handleOnCreateQuiz(event: CreateEventDB<QuizID, QuizDocument>) {
    const entity = quizDocToEntity(event.doc);

    return this.quizCacheRepo.createOne(entity);
  }

  @OnDeleteEvent(QuizEntity)
  handleOnDeleteQuiz(event: DeleteEventDB<QuizID, QuizDocument>) {
    return this.quizCacheRepo.deleteOneById(event.id);
  }
}
