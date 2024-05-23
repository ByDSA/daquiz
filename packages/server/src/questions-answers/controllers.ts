import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { NotFoundInterceptor } from "src/utils/interceptors/NotFoundInterceptor";
import { BooleanPipe, ObjectIdPipe } from "src/utils/validation";
import { CreateQuestionAnswerDto, ResultManyQuestionDto, ResultOneQuestionDto } from "./dtos";
import { QuestionAnswerID } from "./models";
import { QuestionsAnswersService } from "./services";
import { CreateOneAndGetController, FindAllController, FindOneController } from "#/utils/controllers/crud";

@Controller()
export class QuestionsAnswersController implements
  CreateOneAndGetController<CreateQuestionAnswerDto, ResultOneQuestionDto>,
  FindOneController<QuestionAnswerID, ResultOneQuestionDto>,
  FindAllController<ResultManyQuestionDto> {
  constructor(private readonly questionsAnswersService: QuestionsAnswersService) {}

  @Post()
  async createOneAndGet(@Body() dto: CreateQuestionAnswerDto): Promise<ResultOneQuestionDto> {
    const data = await this.questionsAnswersService.createOneAndGet( {
      questionId: dto.questionId,
      answerId: dto.answerId,
      answerType: dto.answerType,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor("Question-Answer not found"))
  async findOne(
    @Param("id", ObjectIdPipe) id: QuestionAnswerID,
    @Query("includeRelations") includeRelationsStr?: string,
  ): Promise<ResultOneQuestionDto> {
    const includeRelations = new BooleanPipe().transform(includeRelationsStr);
    const found = await this.questionsAnswersService.findOne(id, {
      includeRelations: {
        question: includeRelations,
        answer: includeRelations,
      },
    } );

    return {
      data: found,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyQuestionDto> {
    const data = await this.questionsAnswersService.findAll();

    return {
      data,
    };
  }
}
