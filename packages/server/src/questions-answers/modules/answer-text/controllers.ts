import { CreateQuestionTextAnswerDto, ResultOneQuestionTextAnswerDto } from "#shared/models/questions-answers/text-answers/dtos";
import { Body, Controller, Post } from "@nestjs/common";
import { QuestionTextAnswerService } from "./services";
import { CreateOneAndGetController } from "#/utils/controllers/crud";

@Controller()
export class QuestionTextAnswerController implements
CreateOneAndGetController<CreateQuestionTextAnswerDto, ResultOneQuestionTextAnswerDto> {
  constructor(private readonly questionsAnswersService: QuestionTextAnswerService) {}

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
