import { Body, Controller, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { NotFoundInterceptor } from "src/utils/interceptors/NotFoundInterceptor";
import { ObjectIdPipe } from "src/utils/validation";
import { CreateTextQuestionDto, ResultManyTextQuestionDto, ResultOneTextQuestionDto } from "./dtos";
import { ID } from "./models";
import { TextQuestionsService } from "./services";
import { CreateOneAndGetController, FindAllController, FindOneController } from "#/utils/controllers/crud";

@Controller("text")
export class TextQuestionsController implements
  CreateOneAndGetController<CreateTextQuestionDto, ResultOneTextQuestionDto>,
  FindOneController<ID, ResultOneTextQuestionDto>, FindAllController<ResultManyTextQuestionDto> {
  constructor(private readonly textQuestionsService: TextQuestionsService) {}

  @Post()
  async createOneAndGet(@Body() dto: CreateTextQuestionDto): Promise<ResultOneTextQuestionDto> {
    const data = await this.textQuestionsService.createOneAndGet( {
      text: dto.text,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor("Question not found"))
  async findOne(@Param("id", ObjectIdPipe) id: ID): Promise<ResultOneTextQuestionDto> {
    const found = await this.textQuestionsService.findOne(id);

    return {
      data: found,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyTextQuestionDto> {
    const data = await this.textQuestionsService.findAll();

    return {
      data,
    };
  }
}
