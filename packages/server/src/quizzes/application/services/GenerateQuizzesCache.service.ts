import { AnswerType } from "#shared/models/answers/Answer";
import { TextAnswerEntity, TextAnswerID, TextAnswerVO } from "#shared/models/answers/text-answers/TextAnswer";
import { QuestionEntity, QuestionID, QuestionVO } from "#shared/models/questions/Question";
import { Inject, Injectable } from "@nestjs/common";
import extend from "just-extend";
import cron from "node-cron";
import { GenerateQuizzesCacheServicePort, QuizEntity, QuizUpdateEntity, QuizzesCacheRepositoryPort, QuizzesRelationalRepositoryPort } from "../../domain";
import { everyMinutes } from "#/utils/time/cron/Expressions";
import { EventDBEmitter } from "#/events/EventDBEmitter";
import { CreateEventDB, DeleteEventDB, PatchEventDB } from "#/events/EventDB";

@Injectable()
export class GenerateQuizzesCacheService implements GenerateQuizzesCacheServicePort {
  constructor(
    private readonly dbEventEmitter: EventDBEmitter,
    @Inject(QuizzesRelationalRepositoryPort) private readonly quizzesRelationalService: QuizzesRelationalRepositoryPort,
    @Inject(QuizzesCacheRepositoryPort) private readonly quizzesCacheService: QuizzesCacheRepositoryPort,
  ) {
    this.#initializeDependencyPropagationEvents();
    this.generateCache();

    cron.schedule(everyMinutes(10), () => {
      this.generateCache();
    } );
  }

  async generateCache() {
    console.log("Quizzes cache updating");
    const quizzes = await this.quizzesRelationalService.findAll( {
      include: {
        questionsAnswers: {
          question: true,
          answer: true,
        },
      },
    } );

    await this.quizzesCacheService.deleteAll();
    await this.quizzesCacheService.createMany(quizzes);
    console.log("Quizzes cache updated");
  }

  #initializeDependencyPropagationEvents() {
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
          this.quizzesCacheService.addQuestionsAnswers(event.id, addedQuestionsAnswersIds);

        const removedIds = event.updateEntity.questionAnswersIds?.removed;

        if (removedIds)
          this.quizzesCacheService.removeQuestionsAnswers(event.id, removedIds);
      },
    );

    this.dbEventEmitter.onCreate(
      QuizEntity,
      (event: CreateEventDB<QuizEntity>) => {
        this.quizzesCacheService.createOne( {
          id: event.id,
          ...event.valueObject,
        } );
      },
    );

    this.dbEventEmitter.onDelete(
      QuizEntity,
      (event: DeleteEventDB<QuizEntity>) => {
        this.quizzesCacheService.deleteOne(event.id);
      },
    );
  }

  async #patchQuestionReference(id: QuestionID, partialVO: Partial<QuestionVO>) {
    const quizzes = await this.quizzesCacheService.findAll();

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
        await this.quizzesCacheService.updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  async #patchTextAnswerReference(id: TextAnswerID, valueObject: Partial<TextAnswerVO>) {
    const quizzes = await this.quizzesCacheService.findAll();

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
        await this.quizzesCacheService.updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }
}
