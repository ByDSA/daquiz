import { TextAnswerID } from "#shared/models/answers/text-answers/TextAnswer";
import { QuizID } from "#shared/models/quizzes/Quiz";
import { AddQuestionsAnswersDto, CreateQuizDto, ResultManyTextAnswerDto, ResultOneTextAnswerDto } from "#shared/models/quizzes/dtos";
import { Body, Controller, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { NotFoundInterceptor } from "src/utils/interceptors/NotFoundInterceptor";
import { QuizzesService } from "./services";
import { ObjectIdPipe } from "#/utils/validation";
import { CreateOneAndGetController, FindAllController, FindOneController } from "#/utils/controllers/crud";

@Controller()
export class QuizzesController
implements CreateOneAndGetController<CreateQuizDto, ResultOneTextAnswerDto>,
FindOneController<TextAnswerID, ResultOneTextAnswerDto>,
FindAllController<ResultManyTextAnswerDto> {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async createOneAndGet(@Body() dto: CreateQuizDto): Promise<ResultOneTextAnswerDto> {
    const data = await this.quizzesService.createOneAndGet( {
      name: dto.name,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor())
  async findOne(@Param("id", ObjectIdPipe) id: QuizID): Promise<ResultOneTextAnswerDto> {
    const found = await this.quizzesService.findOne(id);

    return {
      data: found,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyTextAnswerDto> {
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
}
