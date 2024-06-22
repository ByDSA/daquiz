/* eslint-disable require-await */
import { Inject, Injectable } from "@nestjs/common";
import { AddQuestionsAnswersDto, CreateQuizDto, QuizEntity, QuizID, QuizzesCacheRepositoryPort, QuizzesRelationalRepositoryPort, QuizzesServicePort } from "../../domain";
import { QuestionAnswerID } from "#/questions-answers/domain";

@Injectable()
export class QuizzesService implements QuizzesServicePort {
  constructor(
    @Inject(QuizzesRelationalRepositoryPort)
    private readonly quizzesRelationalService: QuizzesRelationalRepositoryPort,
    @Inject(QuizzesCacheRepositoryPort)
    private readonly quizzesCacheService: QuizzesCacheRepositoryPort,
  ) {
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
