
import { Injectable } from "@nestjs/common";
import { QuestionsAnswersService } from "../../services";
import { CreateQuestionTextAnswerDto } from "./dtos";
import { QuestionTextAnswerEntity } from "./models";
import { AnswerType } from "#/answers/models";
import { TextAnswersService } from "#/answers/text-answer/services";
import { QuestionsService } from "#/questions/services";
import { CreateOneAndGetService } from "#/utils/services/crud";

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
