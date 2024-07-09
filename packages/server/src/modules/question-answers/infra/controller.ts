import { Body, Controller, Get, Inject, Param, Post, UseInterceptors } from "@nestjs/common";
import { QuestionAnswerID } from "../domain";
import { CreateQuestionAnswerDto, ResultManyQuestionAnswerDto, ResultOneQuestionAnswerDto } from "./domain";
import { QuestionAnswerRepo as Repo } from "./persistence";
import { ObjectIdPipe } from "src/utils/validation";
import { NotFoundInterceptor } from "src/utils/interceptors/NotFoundInterceptor";
import { CreateOneAndGetController, FindAllController, FindOneController } from "#/utils/controllers/crud";

@Controller()
export class QuestionAnswerController implements
  CreateOneAndGetController<CreateQuestionAnswerDto, ResultOneQuestionAnswerDto>,
  FindOneController<QuestionAnswerID, ResultOneQuestionAnswerDto>,
  FindAllController<ResultManyQuestionAnswerDto> {
  constructor(
    @Inject(Repo)
    private readonly repo: Repo,
  ) {}

  @Post()
  async createOneAndGet(@Body() dto: CreateQuestionAnswerDto): Promise<ResultOneQuestionAnswerDto> {
    const data = await this.repo.createOneAndGet( {
      question: dto.question,
      answer: dto.answer,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor("Question-Answer not found"))
  async findOne(
    @Param("id", ObjectIdPipe) id: QuestionAnswerID,
  ): Promise<ResultOneQuestionAnswerDto> {
    const found = await this.repo.findOne(id);

    return {
      data: found ?? undefined,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyQuestionAnswerDto> {
    const data = await this.repo.findAll();

    return {
      data,
    };
  }
}
