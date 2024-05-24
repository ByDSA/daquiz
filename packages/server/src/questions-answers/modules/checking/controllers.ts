import { Body, Controller, Param, Post } from "@nestjs/common";
import { QuestionAnswerCheckingDto } from "#shared/models/questions-answers/checking/dtos";
import { QuestionAnswerCheckingService } from "./services";

@Controller()
export class QuestionAnswerCheckingController {
  constructor(private readonly checkingService: QuestionAnswerCheckingService) {}

  // eslint-disable-next-line require-await
  @Post("/:id")
  async checking(
    @Body() dto: QuestionAnswerCheckingDto,
    @Param("id") id: string,
  ) {
    return this.checkingService.checkAnswer( {
      requestAnswer: dto.answer,
      questionAnswerId: id,
    } );
  }
}
