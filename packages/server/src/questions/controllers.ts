import { QuestionID } from "#shared/models/questions/Question";
import { CreateQuestionDto, ResultManyQuestionDto, ResultOneQuestionDto } from "#shared/models/questions/dtos";
import { Body, Controller, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { ObjectIdPipe } from "src/utils/validation";
import { QuestionsService } from "./services";
import { NotFoundInterceptor } from "#/utils/interceptors/NotFoundInterceptor";
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
