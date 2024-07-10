import { assertDefined } from "#shared/utils/validation/asserts";
import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { QuizEntity, QuizID } from "../../../domain";
import { QuizCacheRepo } from "../repos/QuizCache";
import { quizDocToEntity, QuizDocument, QuizRelationalRepo } from "../repos/QuizRelational";
import { QuizUpdateQuery } from "../repos/QuizRelational/schemas";
import { GenerateQuizzesCacheService } from "./GenerateQuizzesCache.service.port";
import { AnswerType } from "#modules/answers/domain";
import { TextAnswerRepo } from "#modules/answers/submodules/text-answer";
import { TextAnswerEntity, TextAnswerVO } from "#modules/answers/submodules/text-answer/domain";
import { TextAnswer } from "#modules/answers/submodules/text-answer/infra/persistence/repos/schemas/schema";
import { CreateEventDB, DeleteEventDB, PatchEventDB } from "#modules/events/EventDB";
import { OnCreateEvent, OnDeleteEvent, OnPatchEvent } from "#modules/events/EventDBEmitter";
import { QuestionRepo } from "#modules/questions";
import { PartType, QuestionEntity, TextPart } from "#modules/questions/domain";
import { Question } from "#modules/questions/infra/persistence/repos/schemas";
import { getRemovedIdsFromPulledAttribute } from "#utils/db/mongoose/updateQueryFn";

@Injectable()
export class GenerateQuizzesCacheServiceImp implements GenerateQuizzesCacheService {
  private readonly logger: LoggerService = new Logger(this.constructor.name);

  constructor(
    @Inject(QuizRelationalRepo)
    private readonly quizRelationalRepo: QuizRelationalRepo,
    @Inject(QuestionRepo)
    private readonly questionRepo: QuestionRepo,
    @Inject(TextAnswerRepo)
    private readonly textAnswerRepo: TextAnswerRepo,
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
    const { id: questionId, updateQuery: updateDoc } = event;
    const quizzes = await this.quizCacheRepo.findAll();
    const question = await this.questionRepo.findOneByInnerId(questionId);

    assertDefined(question, "Question not found for id=" + questionId);
    const questionAnswerId = question.id;

    for (const quiz of quizzes) {
      quiz.questionAnswers ??= [];
      let haveToUpdateQuiz = false;

      for (const questionAnswer of quiz.questionAnswers) {
        if (questionAnswer.id === questionAnswerId) {
          const newText = updateDoc.$set?.text;

          if (newText) {
            for (const part of questionAnswer.question.parts) {
              if (part.type === PartType.Text) {
                (part as TextPart).text = newText;
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
    const { id: answerId, updateQuery } = event;
    const quizzes = await this.quizCacheRepo.findAll();
    const answer = await this.textAnswerRepo.findOneByInnerId(answerId);

    assertDefined(answer, "Answer not found for id=" + answerId);
    const questionAnswerId = answer.id;

    for (const quiz of quizzes) {
      quiz.questionAnswers ??= [];
      let haveToUpdateQuiz = false;

      for (const questionAnswer of quiz.questionAnswers) {
        const newText = updateQuery.$set?.text;

        if (
          questionAnswer.id === questionAnswerId
          && questionAnswer.answer.type === AnswerType.Text
          && newText
        ) {
          (questionAnswer.answer as TextAnswerVO).text = newText;

          haveToUpdateQuiz = true;
        }
      }

      if (haveToUpdateQuiz)
        await this.quizCacheRepo.updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  @OnPatchEvent(QuizEntity)
  async handleOnPatchQuiz(event: PatchEventDB<QuizID, QuizEntity, QuizUpdateQuery>) {
    const addedQuestionsAnswersIds = event.updateQuery
      .$addToSet?.questionsAnswersIds?.$each?.map(String);

    if (addedQuestionsAnswersIds)
      await this.quizCacheRepo.addQuestionsAnswers(event.id, addedQuestionsAnswersIds);

    const removedIds = getRemovedIdsFromPulledAttribute(
      event.updateQuery.$pull?.questionsAnswersIds,
    );

    if (removedIds && removedIds.length > 0)
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
