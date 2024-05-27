import { TextAnswerID } from "#shared/models/answers/text-answers/TextAnswer";
import { CreateTextAnswerDto, PatchOneTextAnswerDto, ResultManyTextAnswerDto, ResultOneTextAnswerDto } from "#shared/models/answers/text-answers/dtos";
import { Body, Controller, Get, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { TextAnswersService } from "./services";
import { ObjectIdPipe } from "#/utils/validation";
import { NotFoundInterceptor } from "#/utils/interceptors/NotFoundInterceptor";
import { CreateOneAndGetController, FindAllController, FindOneController, PatchOneAndGetController } from "#/utils/controllers/crud";

@Controller("text")
export class TextAnswersController
implements CreateOneAndGetController<CreateTextAnswerDto, ResultOneTextAnswerDto>,
FindOneController<TextAnswerID, ResultOneTextAnswerDto>,
FindAllController<ResultManyTextAnswerDto>,
PatchOneAndGetController<TextAnswerID, PatchOneTextAnswerDto, ResultOneTextAnswerDto> {
  constructor(private readonly textAnswersService: TextAnswersService) {}

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
