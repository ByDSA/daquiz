import { Body, Controller, Inject, Param, Post } from "@nestjs/common";
import { QuestionAnswerCheckingDto } from "./app/models";
import { Service } from "./app/service.port";

@Controller()
export class QuestionAnswerCheckingController {
  constructor(
    @Inject(Service)
    private readonly service: Service,
  ) {}

  // eslint-disable-next-line require-await
  @Post("/:id")
  async checking(
    @Body() dto: QuestionAnswerCheckingDto,
    @Param("id") id: string,
  ) {
    return this.service.checkAnswer( {
      requestAnswer: dto.answer,
      questionAnswerId: id,
    } );
  }
}
