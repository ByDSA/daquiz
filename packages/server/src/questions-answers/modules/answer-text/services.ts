
import { AnswerType } from "#shared/models/answers/Answer";
import { QuestionTextAnswerEntity } from "#shared/models/questions-answers/text-answers/QuestionTextAnswer";
import { CreateQuestionTextAnswerDto } from "#shared/models/questions-answers/text-answers/dtos";
import { Injectable } from "@nestjs/common";
import { QuestionsAnswersService } from "../../services";
import { CreateOneAndGetService } from "#/utils/services/crud";
import { QuestionsService } from "#/questions/services";
import { TextAnswersService } from "#/answers/text-answer/services";

@Injectable()
export class QuestionTextAnswerService implements
CreateOneAndGetService<CreateQuestionTextAnswerDto, QuestionTextAnswerEntity> {
  constructor(
    private readonly questionService: QuestionsService,
    private readonly textAnswerService: TextAnswersService,
    private readonly questionsAnswersService: QuestionsAnswersService,
  ) {}

  async createOneAndGet(
    dto: CreateQuestionTextAnswerDto,
  ): Promise<QuestionTextAnswerEntity> {
    const questionPromise = this.questionService.createOneAndGet( {
      text: dto.question,
    } );
    const answerPromise = this.textAnswerService.createOneAndGet( {
      text: dto.answer,
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
