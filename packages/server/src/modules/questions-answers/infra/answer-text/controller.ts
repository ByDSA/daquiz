import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateQuestionTextAnswerDto, ResultOneQuestionTextAnswerDto } from "./domain";
import { Repo } from "./repository.port";
import { CreateOneAndGetController } from "#/utils/controllers/crud";

@Controller()
export class QuestionTextAnswerController implements
CreateOneAndGetController<CreateQuestionTextAnswerDto, ResultOneQuestionTextAnswerDto> {
  constructor(
    @Inject(Repo)
    private readonly repo: Repo,
  ) {}

  @Post()
  async createOneAndGet(
    @Body() createDto: CreateQuestionTextAnswerDto,
  ): Promise<ResultOneQuestionTextAnswerDto> {
    const data = await this.repo.createOneAndGet( {
      question: createDto.question,
      answer: createDto.answer,
    } );

    return {
      data,
    };
  }
}
