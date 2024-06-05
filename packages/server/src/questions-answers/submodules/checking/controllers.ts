import { Body, Controller, Inject, Param, Post } from "@nestjs/common";
import { QuestionAnswerCheckingDto } from "./domain";
import { QuestionAnswerCheckingServicePort } from "./services/QuestionAnswerChecking.service.port";

@Controller()
export class QuestionAnswerCheckingController {
  constructor(
    @Inject(QuestionAnswerCheckingServicePort) private readonly checkingService: QuestionAnswerCheckingServicePort,
  ) {}

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
