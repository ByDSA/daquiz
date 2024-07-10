import { Body, Controller, Get, Inject, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { CreateOneQuestionDto, PatchOneQuestionDto, ResultManyQuestionDto, ResultOneQuestionDto } from "../domain";
import { QuestionRepo } from "./persistence";
import { QuestionAnswerID } from "#modules/question-answers";
import { CreateOneAndGetController, FindAllController, FindOneController, PatchOneAndGetController } from "#utils/controllers/crud";
import { NotFoundInterceptor } from "#utils/interceptors/NotFoundInterceptor";
import { ObjectIdPipe } from "#utils/validation";

@Controller()
export class QuestionController implements
  CreateOneAndGetController<CreateOneQuestionDto, ResultOneQuestionDto>,
  FindOneController<QuestionAnswerID, ResultOneQuestionDto>,
  FindAllController<ResultManyQuestionDto>,
  PatchOneAndGetController<QuestionAnswerID, PatchOneQuestionDto, ResultOneQuestionDto> {
  constructor(
    @Inject(QuestionRepo)
    private readonly repo: QuestionRepo,
  ) {}

  @Patch(":id")
  async patchOneAndGet(
    @Param("id", ObjectIdPipe) id: QuestionAnswerID,
    @Body() dto: PatchOneQuestionDto,
  ): Promise<ResultOneQuestionDto | undefined> {
    const got = await this.repo.patchOneAndGet(id, dto);

    if (got) {
      return {
        data: got,
      };
    }
  }

  @Post()
  async createOneAndGet(@Body() dto: CreateOneQuestionDto): Promise<ResultOneQuestionDto> {
    const data = await this.repo.createOneAndGet( {
      text: dto.text,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor("Question not found"))
  async findOne(@Param("id", ObjectIdPipe) id: QuestionAnswerID): Promise<ResultOneQuestionDto> {
    const found = await this.repo.findOne(id);

    return {
      data: found ?? undefined,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyQuestionDto> {
    const data = await this.repo.findAll();

    return {
      data,
    };
  }
}
