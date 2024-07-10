import { Body, Controller, Delete, Get, Inject, Param, Post, UseInterceptors } from "@nestjs/common";
import { QuestionAnswerPickerService } from "../app/QuestionAnswerPicker.service.port";
import { AddQuestionsAnswersDto, CreateQuizDto, QuizID, RemoveManyQuestionsAnswersDto, ResultManyQuizDto, ResultOneQuizDto, ResultQuizPickQuestionsAnswersDto } from "../domain";
import { QuizRepo } from "./persistence";
import { CreateOneAndGetController, FindAllController, FindOneController } from "#/utils/controllers/crud";
import { NotFoundInterceptor } from "#/utils/interceptors/NotFoundInterceptor";
import { ObjectIdPipe } from "#/utils/validation";
import { QuestionAnswerID } from "#modules/question-answers/domain";

@Controller()
export class QuizzesController
implements CreateOneAndGetController<CreateQuizDto, ResultOneQuizDto>,
FindOneController<QuestionAnswerID, ResultOneQuizDto>,
FindAllController<ResultManyQuizDto> {
  constructor(
    @Inject(QuizRepo)
    private readonly quizRepo: QuizRepo,
    @Inject(QuestionAnswerPickerService)
    private readonly pickerService: QuestionAnswerPickerService,
  ) {}

  @Post()
  async createOneAndGet(@Body() dto: CreateQuizDto): Promise<ResultOneQuizDto> {
    const data = await this.quizRepo.createOneAndGet( {
      name: dto.name,
    } );

    return {
      data,
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor())
  async findOne(@Param("id", ObjectIdPipe) id: QuizID): Promise<ResultOneQuizDto> {
    const found = await this.quizRepo.findOne(id);

    return {
      data: found ?? undefined,
    };
  }

  @Get()
  async findAll(): Promise<ResultManyQuizDto> {
    const data = await this.quizRepo.findAll();

    return {
      data,
    };
  }

  @Post(":id/add")
  async addManyQuestionsAnswers(
    @Param("id", ObjectIdPipe) id: QuizID,
    @Body() dto: AddQuestionsAnswersDto,
  ): Promise<void> {
    await this.quizRepo.addManyQuestionsAnswers(id, {
      questionsAnswersIds: dto.questionsAnswersIds,
    } );
  }

  @Delete(":id/remove/:questionAnswerId")
  async removeOneQuestionAnswer(
    @Param("id", ObjectIdPipe) id: QuizID,
    @Param("questionAnswerId", ObjectIdPipe) questionAnswerId: QuestionAnswerID,
  ): Promise<void> {
    await this.quizRepo.removeOneQuestionAnswer(id, questionAnswerId);
  }

  @Delete(":id/remove")
  async removeManyQuestionsAnswers(
    @Param("id", ObjectIdPipe) id: QuizID,
    @Body() dto: RemoveManyQuestionsAnswersDto,
  ): Promise<void> {
    await this.quizRepo.removeManyQuestionsAnswers(id, dto.ids);
  }

  @Get(":id/pickQuestion")
  async pickQuestion(@Param("id", ObjectIdPipe) id: QuizID): Promise<ResultQuizPickQuestionsAnswersDto> {
    return await this.pickerService.pickOneQuestionAnswer(id);
  }
}
