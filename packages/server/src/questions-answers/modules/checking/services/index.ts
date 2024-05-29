import { UnknownAnswerVO } from "#shared/models/answers/unknown-answers/UnknownAnswer";
import { parseAnswer } from "#shared/models/answers/validation";
import { WithRequired } from "#shared/utils/typescript";
import { assertDefined } from "#shared/utils/validation/asserts";
import { BadRequestException, Injectable } from "@nestjs/common";
import { AnswerCheckerProps } from "./answer-checkers/answer-checker";
import { getAnswerCheckerByType } from "./answer-checkers/get-checker";
import { QuestionsAnswersService } from "#/questions-answers/services";
import { HistoryEntriesService } from "#/historyEntries/services";

type CheckAnswerProps = WithRequired<AnswerCheckerProps<UnknownAnswerVO>, "questionAnswerId"> & {
  includeQuestion?: boolean;
};

@Injectable()
export class QuestionAnswerCheckingService {
  constructor(
    private readonly questionsAnswersService: QuestionsAnswersService,
    private readonly historyEntriesService: HistoryEntriesService,
  ) {}

  async checkAnswer( { requestAnswer, questionAnswerId, includeQuestion }: CheckAnswerProps) {
    const questionAnswer = await this.questionsAnswersService.findOne(questionAnswerId, {
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
      correctAnswer,
    };

    if (questionAnswer.question) {
      (answerCheckerProps as AnswerCheckerProps<UnknownAnswerVO>)
        .question = questionAnswer.question;
    }

    const checkResult = await answerChecker(answerCheckerProps);

    this.historyEntriesService.createOne( {
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
