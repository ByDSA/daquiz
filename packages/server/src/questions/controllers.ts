import { Body, Controller, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { NotFoundInterceptor } from "src/utils/interceptors/NotFoundInterceptor";
import { ObjectIdPipe } from "src/utils/validation";
import { CreateQuestionDto, ResultManyQuestionDto, ResultOneQuestionDto } from "./dtos";
import { QuestionID } from "./models";
import { QuestionsService } from "./services";
import { CreateOneAndGetController, FindAllController, FindOneController } from "#/utils/controllers/crud";

@Controller()
export class QuestionsController implements
  CreateOneAndGetController<CreateQuestionDto, ResultOneQuestionDto>,
  FindOneController<QuestionID, ResultOneQuestionDto>, FindAllController<ResultManyQuestionDto> {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async createOneAndGet(@Body() dto: CreateQuestionDto): Promise<ResultOneQuestionDto> {
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
      data: found,
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
