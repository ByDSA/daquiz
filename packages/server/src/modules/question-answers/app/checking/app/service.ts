import { assertDefined } from "#shared/utils/validation/asserts";
import { Inject, Injectable } from "@nestjs/common";
import { QuestionAnswerRepo } from "../../../infra";
import { AnswerCheckerProps } from "./answer-checkers/answer-checker";
import { resolveAnswerCheckerByType } from "./answer-checkers/get-checker";
import { CheckAnswerProps, Service } from "./service.port";
import { HistoryEntryRepo } from "#modules/history-entries";
import { AnswerVO } from "#modules/answers/domain";
@Injectable()
export class ServiceImp implements Service {
  constructor(
    @Inject(QuestionAnswerRepo)
    private readonly questionAnswerRepo: QuestionAnswerRepo,
    @Inject(HistoryEntryRepo)
    private readonly historyEntryRepo: HistoryEntryRepo,
  ) {}

  async checkAnswer( { requestAnswer,
    questionAnswerId,
    askForCorrectAnswer }: CheckAnswerProps) {
    const questionAnswer = await this.questionAnswerRepo.findOne(questionAnswerId);

    assertDefined(questionAnswer, "Correct answer not found");
    const correctAnswer = questionAnswer?.answer;
    const answerType = questionAnswer.answer.type;
    const answerChecker = resolveAnswerCheckerByType(answerType);
    const answerCheckerProps: AnswerCheckerProps<AnswerVO> = {
      questionAnswerId,
      questionId: questionAnswer.id,
      requestAnswer: requestAnswer,
      askForCorrectAnswer: askForCorrectAnswer,
      correctAnswer,
    };

    if (questionAnswer.question) {
      (answerCheckerProps as AnswerCheckerProps<AnswerVO>)
        .question = questionAnswer.question;
    }

    const checkResult = await answerChecker(answerCheckerProps);

    this.historyEntryRepo.createOne( {
      enteredAnswer: {
        answer: requestAnswer,
        answerType,
      },
      checkResult,
      questionAnswerId,
    } );

    return checkResult;
  }
}
