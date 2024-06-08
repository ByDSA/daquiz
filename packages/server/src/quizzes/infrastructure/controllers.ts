import { Body, Controller, Delete, Get, Inject, Param, Post, UseInterceptors } from "@nestjs/common";
import { AddQuestionsAnswersDto, CreateQuizDto, QuizID, QuizzesServicePort, RemoveManyQuestionsAnswersDto, ResultManyQuizDto, ResultOneQuizDto, ResultQuizPickQuestionsAnswersDto } from "../domain";
import { TextAnswerID } from "#/answers/text-answer/domain";
import { QuestionAnswerID } from "#/questions-answers/domain";
import { CreateOneAndGetController, FindAllController, FindOneController } from "#/utils/controllers/crud";
import { NotFoundInterceptor } from "#/utils/interceptors/NotFoundInterceptor";
import { ObjectIdPipe } from "#/utils/validation";

@Controller()
export class QuizzesController
implements CreateOneAndGetController<CreateQuizDto, ResultOneQuizDto>,
FindOneController<TextAnswerID, ResultOneQuizDto>,
FindAllController<ResultManyQuizDto> {
  constructor(
    @Inject(QuizzesServicePort) private readonly quizzesService: QuizzesServicePort,
  ) {}

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
  async addManyQuestionsAnswers(
    @Param("id", ObjectIdPipe) id: QuizID,
    @Body() dto: AddQuestionsAnswersDto,
  ): Promise<void> {
    await this.quizzesService.addManyQuestionsAnswers(id, {
      questionsAnswersIds: dto.questionsAnswersIds,
    } );
  }

  @Delete(":id/remove/:questionAnswerId")
  async removeOneQuestionAnswer(
    @Param("id", ObjectIdPipe) id: QuizID,
    @Param("questionAnswerId", ObjectIdPipe) questionAnswerId: QuestionAnswerID,
  ): Promise<void> {
    await this.quizzesService.removeOneQuestionAnswer(id, questionAnswerId);
  }

  @Delete(":id/remove")
  async removeManyQuestionsAnswers(
    @Param("id", ObjectIdPipe) id: QuizID,
    @Body() dto: RemoveManyQuestionsAnswersDto,
  ): Promise<void> {
    await this.quizzesService.removeManyQuestionsAnswers(id, dto.ids);
  }

  @Get(":id/pickQuestion")
  async pickQuestion(@Param("id", ObjectIdPipe) id: QuizID): Promise<ResultQuizPickQuestionsAnswersDto> {
    return await this.quizzesService.pickQuestionsAnswers(id);
  }
}