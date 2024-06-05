import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuizEntity, QuizID } from "#shared/models/quizzes/Quiz";
import { AddQuestionsAnswersDto, CreateQuizDto, ResultQuizPickQuestionsAnswersDto } from "#shared/models/quizzes/dtos";
import { Injectable } from "@nestjs/common";
import { IReadService } from "./repositories/IReadService";
import { IWriteService } from "./repositories/IWriteService";
import { QuizzesCacheRepository } from "./repositories/QuizzesCacheRepository";
import { QuizzesRelationalRepository } from "./repositories/QuizzesRelationalRepository";

@Injectable()
export class QuizzesService implements IReadService, IWriteService {
  constructor(
    private readonly quizzesRelationalService: QuizzesRelationalRepository,
    private readonly quizzesCacheService: QuizzesCacheRepository,
  ) {

  }

  pickQuestionsAnswers(id: string): Promise<ResultQuizPickQuestionsAnswersDto> {
    return this.quizzesCacheService.pickQuestionsAnswers(id);
  }

  createOneAndGet(dto: CreateQuizDto): Promise<QuizEntity> {
    return this.quizzesRelationalService.createOneAndGet(dto);
  }

  findOne(id: string): Promise<QuizEntity | null> {
    return this.quizzesCacheService.findOne(id);
  }

  findAll(): Promise<QuizEntity[]> {
    return this.quizzesCacheService.findAll();
  }

  async addManyQuestionsAnswers(id: QuizID, dto: AddQuestionsAnswersDto): Promise<void> {
    return this.quizzesRelationalService.addManyQuestionsAnswers(id, dto);
  }

  async removeOneQuestionAnswer(id: QuizID, questionAnswerId: string): Promise<void> {
    return this.quizzesRelationalService.removeOneQuestionAnswer(id, questionAnswerId);
  }

  async removeManyQuestionsAnswers(
    id: QuizID,
    questionAnswerIds: QuestionAnswerID[],
  ): Promise<void> {
    return this.quizzesRelationalService.removeManyQuestionsAnswers(id, questionAnswerIds);
  }
}
