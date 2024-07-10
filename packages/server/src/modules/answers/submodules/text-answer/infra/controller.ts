import { Body, Controller, Get, Inject, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { CreateTextAnswerDto, PatchOneTextAnswerDto, ResultManyTextAnswerDto, ResultOneTextAnswerDto } from "../domain";
import { TextAnswerRepo } from "./persistence";
import { Repo } from "./persistence/repos/repository.port";
import { ObjectIdPipe } from "#utils/validation";
import { NotFoundInterceptor } from "#utils/interceptors/NotFoundInterceptor";
import { CreateOneAndGetController, FindAllController, FindOneController, PatchOneAndGetController } from "#utils/controllers/crud";

type TextAnswerID = string;

@Controller("text")
export class TextAnswersController
implements CreateOneAndGetController<CreateTextAnswerDto, ResultOneTextAnswerDto>,
FindOneController<TextAnswerID, ResultOneTextAnswerDto>,
FindAllController<ResultManyTextAnswerDto>,
PatchOneAndGetController<TextAnswerID, PatchOneTextAnswerDto, ResultOneTextAnswerDto> {
  constructor(
    @Inject(Repo) private readonly repo: TextAnswerRepo,
  ) {}

  @Patch(":id")
  async patchOneAndGet(
    @Param("id", ObjectIdPipe) id: TextAnswerID,
    @Body() dto: PatchOneTextAnswerDto,
  ): Promise<ResultOneTextAnswerDto | undefined> {
    const got = await this.repo.patchOneAndGet(id, dto);

    if (got) {
      return {
        data: got,
      };
    }
  }

  @Post()
  async createOneAndGet(@Body() dto: CreateTextAnswerDto): Promise<ResultOneTextAnswerDto> {
    const data = await this.repo.createOneAndGet( {
      text: dto.text,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor("Answer not found"))
  async findOne(@Param("id", ObjectIdPipe) id: TextAnswerID): Promise<ResultOneTextAnswerDto> {
    const found = await this.repo.findOne(id);

    return {
      data: found ?? undefined,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyTextAnswerDto> {
    const data = await this.repo.findAll();

    return {
      data,
    };
  }
}
