import { Inject, Injectable } from "@nestjs/common";
import { QuestionAnswerRepo } from "../questions-answers";
import { CreateQuestionTextAnswerDto, QuestionTextAnswerEntity } from "./domain";
import { Repo } from "./repository.port";
import { QuestionRepo } from "#modules/questions";
import { TextAnswerRepo } from "#modules/answers/submodules/text-answer";
import { AnswerType } from "#modules/answers/domain";

@Injectable()
export class RepoImp implements Repo {
  constructor(
    @Inject(QuestionRepo) private readonly questionRepo: QuestionRepo,
    @Inject(TextAnswerRepo) private readonly textAnswerRepo: TextAnswerRepo,
    @Inject(QuestionAnswerRepo)
    private readonly repo: QuestionAnswerRepo,
  ) {}

  async createOneAndGet(
    dto: CreateQuestionTextAnswerDto,
  ): Promise<QuestionTextAnswerEntity> {
    const questionPromise = this.questionRepo.createOneAndGet( {
      text: dto.question.text,
      choices: dto.question.choices,
    } );
    const answerPromise = this.textAnswerRepo.createOneAndGet( {
      text: dto.answer.text,
    } );

    await Promise.all([questionPromise, answerPromise]);

    const question = await questionPromise;
    const answer = await answerPromise;
    const data = this.repo.createOneAndGet( {
      questionId: question.id,
      answerType: AnswerType.TEXT,
      answerId: answer.id,
    } );

    return data;
  }
}
