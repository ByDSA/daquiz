import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { NotFoundInterceptor } from "src/utils/interceptors/NotFoundInterceptor";
import { ObjectIdPipe } from "src/utils/validation";
import { CreateQuestionAnswerDto, ResultManyTextQuestionDto, ResultOneTextQuestionDto } from "./dtos";
import { ID } from "./models";
import { QuestionsAnswersService } from "./services";
import { CreateOneAndGetController, FindAllController, FindOneController } from "#/utils/controllers/crud";

@Controller()
export class QuestionsAnswersController implements
  CreateOneAndGetController<CreateQuestionAnswerDto, ResultOneTextQuestionDto>,
  FindOneController<ID, ResultOneTextQuestionDto>, FindAllController<ResultManyTextQuestionDto> {
  constructor(private readonly questionsAnswersService: QuestionsAnswersService) {}

  @Post()
  async createOneAndGet(@Body() dto: CreateQuestionAnswerDto): Promise<ResultOneTextQuestionDto> {
    const data = await this.questionsAnswersService.createOneAndGet( {
      questionType: dto.questionType,
      questionId: dto.questionId,
      answerId: dto.answerId,
      answerType: dto.answerType,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor("Question not found"))
  async findOne(
    @Param("id", ObjectIdPipe) id: ID,
    @Query("includeRelations") includeRelations: boolean = false,
  ): Promise<ResultOneTextQuestionDto> {
    const found = await this.questionsAnswersService.findOne(id, {
      includeRelations,
    } );

    return {
      data: found,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyTextQuestionDto> {
    const data = await this.questionsAnswersService.findAll();

    return {
      data,
    };
  }
}
