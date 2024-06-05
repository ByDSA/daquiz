import { Body, Controller, Get, Inject, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { TextAnswersServicePort } from "./TextAnswers.service.port";
import { CreateTextAnswerDto, PatchOneTextAnswerDto, ResultManyTextAnswerDto, ResultOneTextAnswerDto, TextAnswerID } from "./domain";
import { CreateOneAndGetController, FindAllController, FindOneController, PatchOneAndGetController } from "#/utils/controllers/crud";
import { NotFoundInterceptor } from "#/utils/interceptors/NotFoundInterceptor";
import { ObjectIdPipe } from "#/utils/validation";

@Controller("text")
export class TextAnswersController
implements CreateOneAndGetController<CreateTextAnswerDto, ResultOneTextAnswerDto>,
FindOneController<TextAnswerID, ResultOneTextAnswerDto>,
FindAllController<ResultManyTextAnswerDto>,
PatchOneAndGetController<TextAnswerID, PatchOneTextAnswerDto, ResultOneTextAnswerDto> {
  constructor(
    @Inject(TextAnswersServicePort) private readonly textAnswersService: TextAnswersServicePort,
  ) {}

  @Patch(":id")
  async patchOneAndGet(
    @Param("id", ObjectIdPipe) id: TextAnswerID,
    @Body() dto: PatchOneTextAnswerDto,
  ): Promise<ResultOneTextAnswerDto | undefined> {
    const got = await this.textAnswersService.patchOneAndGet(id, dto);

    if (got) {
      return {
        data: got,
      };
    }
  }

  @Post()
  async createOneAndGet(@Body() dto: CreateTextAnswerDto): Promise<ResultOneTextAnswerDto> {
    const data = await this.textAnswersService.createOneAndGet( {
      text: dto.text,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor("Answer not found"))
  async findOne(@Param("id", ObjectIdPipe) id: TextAnswerID): Promise<ResultOneTextAnswerDto> {
    const found = await this.textAnswersService.findOne(id);

    return {
      data: found ?? undefined,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyTextAnswerDto> {
    const data = await this.textAnswersService.findAll();

    return {
      data,
    };
  }
}
