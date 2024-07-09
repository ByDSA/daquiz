/* eslint-disable require-await */
import { Inject, Injectable } from "@nestjs/common";
import { AddQuestionsAnswersDto, CreateQuizDto, QuizEntity, QuizID } from "../../../domain";
import { QuizCacheRepo } from "./QuizCache";
import { QuizRelationalRepo } from "./QuizRelational";
import { Repo } from "./repository.port";
import { QuestionAnswerID } from "#modules/question-answers/domain";

@Injectable()
export class RepoImp implements Repo {
  constructor(
    @Inject(QuizRelationalRepo)
    private readonly quizzesRelationalRepository: QuizRelationalRepo,
    @Inject(QuizCacheRepo)
    private readonly quizzesCacheRepository: QuizCacheRepo,
  ) {
  }

  createOneAndGet(dto: CreateQuizDto): Promise<QuizEntity> {
    return this.quizzesRelationalRepository.createOneAndGet(dto);
  }

  findOne(id: string): Promise<QuizEntity | null> {
    return this.quizzesCacheRepository.findOne(id);
  }

  findAll(): Promise<QuizEntity[]> {
    return this.quizzesCacheRepository.findAll();
  }

  async addManyQuestionsAnswers(id: QuizID, dto: AddQuestionsAnswersDto): Promise<void> {
    return this.quizzesRelationalRepository.addManyQuestionsAnswers(id, dto);
  }

  async removeOneQuestionAnswer(id: QuizID, questionAnswerId: string): Promise<void> {
    return this.quizzesRelationalRepository.removeOneQuestionAnswer(id, questionAnswerId);
  }

  async removeManyQuestionsAnswers(
    id: QuizID,
    questionAnswerIds: QuestionAnswerID[],
  ): Promise<void> {
    return this.quizzesRelationalRepository.removeManyQuestionsAnswers(id, questionAnswerIds);
  }
}
