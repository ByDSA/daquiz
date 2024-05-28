import { TextAnswerID } from "#shared/models/answers/text-answers/TextAnswer";
import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuizID } from "#shared/models/quizzes/Quiz";
import { AddQuestionsAnswersDto, CreateQuizDto, ResultManyQuizDto, ResultOneQuizDto } from "#shared/models/quizzes/dtos";
import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { QuizzesService } from "./services";
import { ObjectIdPipe } from "#/utils/validation";
import { NotFoundInterceptor } from "#/utils/interceptors/NotFoundInterceptor";
import { CreateOneAndGetController, FindAllController, FindOneController } from "#/utils/controllers/crud";

@Controller()
export class QuizzesController
implements CreateOneAndGetController<CreateQuizDto, ResultOneQuizDto>,
FindOneController<TextAnswerID, ResultOneQuizDto>,
FindAllController<ResultManyQuizDto> {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async createOneAndGet(@Body() dto: CreateQuizDto): Promise<ResultOneQuizDto> {
    const data = await this.quizzesService.createOneAndGet( {
      name: dto.name,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor())
  async findOne(@Param("id", ObjectIdPipe) id: QuizID): Promise<ResultOneQuizDto> {
    const found = await this.quizzesService.findOne(id);

    return {
      data: found ?? undefined,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyQuizDto> {
    const data = await this.quizzesService.findAll();

    return {
      data,
    };
  }

  @Post(":id/add")
  async addQuestionsAnswers(
    @Param("id", ObjectIdPipe) id: QuizID,
    @Body() dto: AddQuestionsAnswersDto,
  ): Promise<void> {
    await this.quizzesService.addQuestionsAnswers(id, {
      questionsAnswersIds: dto.questionsAnswersIds,
    } );
  }

  @Delete(":id/remove/:questionAnswerId")
  async removeQuestionsAnswers(
    @Param("id", ObjectIdPipe) id: QuizID,
    @Param("questionAnswerId", ObjectIdPipe) questionAnswerId: QuestionAnswerID,
  ): Promise<void> {
    await this.quizzesService.removeOneQuestionAnswer(id, questionAnswerId);
  }
}
