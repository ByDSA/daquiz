import { Body, Controller, Inject, Post } from "@nestjs/common";
import { QuestionTextAnswerServicePort } from "./QuestionTextAnswer.service.port";
import { CreateQuestionTextAnswerDto, ResultOneQuestionTextAnswerDto } from "./domain";
import { CreateOneAndGetController } from "#/utils/controllers/crud";

@Controller()
export class QuestionTextAnswerController implements
CreateOneAndGetController<CreateQuestionTextAnswerDto, ResultOneQuestionTextAnswerDto> {
  constructor(
    @Inject(QuestionTextAnswerServicePort)
    private readonly questionsAnswersService: QuestionTextAnswerServicePort,
  ) {}

  @Post()
  async createOneAndGet(
    @Body() createDto: CreateQuestionTextAnswerDto,
  ): Promise<ResultOneQuestionTextAnswerDto> {
    const data = await this.questionsAnswersService.createOneAndGet( {
      question: createDto.question,
      answer: createDto.answer,
    } );

    return {
      data,
    };
  }
}
