import { Inject, Injectable } from "@nestjs/common";
import { QuestionTextAnswerServicePort } from "./QuestionTextAnswer.service.port";
import { CreateQuestionTextAnswerDto, QuestionTextAnswerEntity } from "./domain";
import { AnswerType } from "#/answers/domain";
import { TextAnswersServicePort } from "#/answers/text-answer";
import { QuestionsServicePort } from "#/questions";
import { QuestionsAnswersRepositoryPort } from "#/questions-answers/domain";

@Injectable()
export class QuestionTextAnswerService implements QuestionTextAnswerServicePort {
  constructor(
    @Inject(QuestionsServicePort) private readonly questionService: QuestionsServicePort,
    @Inject(TextAnswersServicePort) private readonly textAnswerService: TextAnswersServicePort,
    @Inject(QuestionsAnswersRepositoryPort) private readonly questionsAnswersService: QuestionsAnswersRepositoryPort,
  ) {}

  async createOneAndGet(
    dto: CreateQuestionTextAnswerDto,
  ): Promise<QuestionTextAnswerEntity> {
    const questionPromise = this.questionService.createOneAndGet( {
      text: dto.question.text,
      choices: dto.question.choices,
    } );
    const answerPromise = this.textAnswerService.createOneAndGet( {
      text: dto.answer.text,
    } );

    await Promise.all([questionPromise, answerPromise]);

    const question = await questionPromise;
    const answer = await answerPromise;
    const data = this.questionsAnswersService.createOneAndGet( {
      questionId: question.id,
      answerType: AnswerType.TEXT,
      answerId: answer.id,
    } );

    return data;
  }
}
