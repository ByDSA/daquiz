import { assertDefined } from "#shared/utils/validation/asserts";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CheckAnswerProps, QuestionAnswerCheckingServicePort } from "./QuestionAnswerChecking.service.port";
import { AnswerCheckerProps } from "./answer-checkers/answer-checker";
import { getAnswerCheckerByType } from "./answer-checkers/get-checker";
import { QuestionsAnswersRepositoryPort } from "#/questions-answers/domain";
import { HistoryEntriesServicePort } from "#/historyEntries";
import { UnknownAnswerVO, parseAnswer } from "#/answers/domain";
@Injectable()
export class QuestionAnswerCheckingService implements QuestionAnswerCheckingServicePort {
  constructor(
    @Inject(QuestionsAnswersRepositoryPort) private readonly questionsAnswersService: QuestionsAnswersRepositoryPort,
    @Inject(HistoryEntriesServicePort) private readonly historyEntriesService: HistoryEntriesServicePort,
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
