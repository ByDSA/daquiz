import { Body, Controller, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { NotFoundInterceptor } from "src/utils/interceptors/NotFoundInterceptor";
import { ObjectIdPipe } from "src/utils/validation";
import { CreateTextAnswerDto, ResultManyTextAnswerDto, ResultOneTextAnswerDto } from "./dtos";
import { ID } from "./models";
import { TextAnswersService } from "./services";
import { CreateOneAndGetController, FindAllController, FindOneController } from "#/utils/controllers/crud";

@Controller("text")
export class TextAnswersController
implements CreateOneAndGetController<CreateTextAnswerDto, ResultOneTextAnswerDto>,
FindOneController<ID, ResultOneTextAnswerDto>,
FindAllController<ResultManyTextAnswerDto> {
  constructor(private readonly textAnswersService: TextAnswersService) {}

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
  async findOne(@Param("id", ObjectIdPipe) id: ID): Promise<ResultOneTextAnswerDto> {
    const found = await this.textAnswersService.findOne(id);

    return {
      data: found,
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
