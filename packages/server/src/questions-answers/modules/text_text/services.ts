
import { Injectable } from "@nestjs/common";
import { QuestionsAnswersService } from "../../services";
import { CreateTextQuestionTextAnswerDto } from "./dtos";
import { TextQuestionTextAnswerEntity } from "./models";
import { AnswerType } from "#/answers/models";
import { TextAnswersService } from "#/answers/text-answer/services";
import { QuestionType } from "#/questions/models";
import { TextQuestionsService } from "#/questions/text-question/services";
import { CreateOneAndGetService } from "#/utils/services/crud";

@Injectable()
export class TextQuestionTextAnswerService implements
CreateOneAndGetService<CreateTextQuestionTextAnswerDto, TextQuestionTextAnswerEntity> {
  constructor(
    private readonly textQuestionService: TextQuestionsService,
    private readonly textAnswerService: TextAnswersService,
    private readonly questionsAnswersService: QuestionsAnswersService,
  ) {}

  async createOneAndGet(
    dto: CreateTextQuestionTextAnswerDto,
  ): Promise<TextQuestionTextAnswerEntity> {
    const questionPromise = this.textQuestionService.createOneAndGet( {
      text: dto.question,
    } );
    const answerPromise = this.textAnswerService.createOneAndGet( {
      text: dto.answer,
    } );

    await Promise.all([questionPromise, answerPromise]);

    const question = await questionPromise;
    const answer = await answerPromise;
    const data = this.questionsAnswersService.createOneAndGet( {
      questionType: QuestionType.TEXT,
      questionId: question.id,
      answerType: AnswerType.TEXT,
      answerId: answer.id,
    } );

    return data;
  }
}
