import { Body, Controller, Post } from "@nestjs/common";
import { CreateTextQuestionTextAnswerDto, ResultOneTextQuestionTextAnswerDto } from "./dtos";
import { TextQuestionTextAnswerService } from "./services";
import { CreateOneAndGetController } from "#/utils/controllers/crud";

@Controller()
export class TextQuestionTextAnswerController implements
CreateOneAndGetController<CreateTextQuestionTextAnswerDto, ResultOneTextQuestionTextAnswerDto> {
  constructor(private readonly questionsAnswersService: TextQuestionTextAnswerService) {}

  @Post()
  async createOneAndGet(
    @Body() createDto: CreateTextQuestionTextAnswerDto,
  ): Promise<ResultOneTextQuestionTextAnswerDto> {
    const data = await this.questionsAnswersService.createOneAndGet( {
      question: createDto.question,
      answer: createDto.answer,
    } );

    return {
      data,
    };
  }
}
