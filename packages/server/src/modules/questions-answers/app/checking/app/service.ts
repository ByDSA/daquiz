import { assertDefined } from "#shared/utils/validation/asserts";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { QuestionAnswerRepo } from "../../../infra";
import { AnswerCheckerProps } from "./answer-checkers/answer-checker";
import { getAnswerCheckerByType } from "./answer-checkers/get-checker";
import { CheckAnswerProps, Service } from "./service.port";
import { HistoryEntryRepo } from "#modules/history-entries";
import { UnknownAnswerVO, parseAnswer } from "#modules/answers/domain";
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
    includeQuestion,
    askForCorrectAnswer }: CheckAnswerProps) {
    const questionAnswer = await this.questionAnswerRepo.findOne(questionAnswerId, {
      includeRelations: {
        question: includeQuestion,
        answer: true,
      },
    } );

    assertDefined(questionAnswer, "Correct answer not found");
    const correctAnswer = questionAnswer?.answer;
    const { answerType } = questionAnswer;
    const validRequestAnswer = await parseAnswer(requestAnswer, answerType).catch(e => {
      throw new BadRequestException(`Request answer parsing error: ${e.message}`);
    } );
    const answerChecker = getAnswerCheckerByType(answerType);
    const answerCheckerProps: AnswerCheckerProps<UnknownAnswerVO> = {
      questionAnswerId,
      questionId: questionAnswer.questionId,
      requestAnswer: validRequestAnswer,
      askForCorrectAnswer: askForCorrectAnswer,
      correctAnswer,
    };

    if (questionAnswer.question) {
      (answerCheckerProps as AnswerCheckerProps<UnknownAnswerVO>)
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
