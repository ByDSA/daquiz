import { Body, Controller, Get, Inject, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { QuestionsServicePort } from "./Questions.service.port";
import { CreateOneQuestionDto, PatchOneQuestionDto, QuestionID, ResultManyQuestionDto, ResultOneQuestionDto } from "./domain";
import { CreateOneAndGetController, FindAllController, FindOneController, PatchOneAndGetController } from "#/utils/controllers/crud";
import { NotFoundInterceptor } from "#/utils/interceptors/NotFoundInterceptor";
import { ObjectIdPipe } from "#/utils/validation";

@Controller()
export class QuestionsController implements
  CreateOneAndGetController<CreateOneQuestionDto, ResultOneQuestionDto>,
  FindOneController<QuestionID, ResultOneQuestionDto>,
  FindAllController<ResultManyQuestionDto>,
  PatchOneAndGetController<QuestionID, PatchOneQuestionDto, ResultOneQuestionDto> {
  constructor(
    @Inject(QuestionsServicePort) private readonly questionsService: QuestionsServicePort,
  ) {}

  @Patch(":id")
  async patchOneAndGet(
    @Param("id", ObjectIdPipe) id: QuestionID,
    @Body() dto: PatchOneQuestionDto,
  ): Promise<ResultOneQuestionDto | undefined> {
    const got = await this.questionsService.patchOneAndGet(id, dto);

    if (got) {
      return {
        data: got,
      };
    }
  }

  @Post()
  async createOneAndGet(@Body() dto: CreateOneQuestionDto): Promise<ResultOneQuestionDto> {
    const data = await this.questionsService.createOneAndGet( {
      text: dto.text,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor("Question not found"))
  async findOne(@Param("id", ObjectIdPipe) id: QuestionID): Promise<ResultOneQuestionDto> {
    const found = await this.questionsService.findOne(id);

    return {
      data: found ?? undefined,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyQuestionDto> {
    const data = await this.questionsService.findAll();

    return {
      data,
    };
  }
}
