import { assertDefined } from "#shared/utils/validation/asserts";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionAnswerEntity, QuestionAnswerID } from "../../../domain";
import { CreateQuestionAnswerDto } from "../domain";
import { docToEntity } from "./adapters";
import { Repo, RepoFindOptions } from "./repository.port";
import { QuestionAnswer, QuestionAnswerDocument } from "./schema";
import { QuestionRepo } from "#modules/questions";
import { TextAnswerRepo } from "#modules/answers/submodules/text-answer";

@Injectable()
export class RepoImp implements Repo {
  constructor(
    @InjectModel(QuestionAnswer.name) private readonly QuestionAnswerModel: Model<QuestionAnswer>,
    @Inject(QuestionRepo) private readonly questionRepo: QuestionRepo,
    @Inject(TextAnswerRepo) private readonly textAnswerRepo: TextAnswerRepo,
  ) {}

  async createOneAndGet(dto: CreateQuestionAnswerDto): Promise<QuestionAnswerEntity> {
    let created = new this.QuestionAnswerModel(dto);

    created = await created.save();

    return docToEntity(created);
  }

  async findOne(
    id: QuestionAnswerID,
    options?: RepoFindOptions,
  ): Promise<QuestionAnswerEntity | null> {
    const doc = await this.QuestionAnswerModel.findById(id).exec();

    if (!doc)
      return null;

    const entity = docToEntity(doc);
    // Population
    const populatePromises: Promise<any>[] = [];

    if (options?.includeRelations?.question) {
      const p = this.questionRepo.findOne(entity.questionId)
        .then((got) => {
          assertDefined(got, "Question not found for id=" + entity.questionId);
          entity.question = got;
        } );

      populatePromises.push(p);
    }

    if (options?.includeRelations?.answer) {
      const p = this.textAnswerRepo.findOne(entity.answerId)
        .then((got) => {
          assertDefined(got, "Answer not found for id=" + entity.answerId);
          entity.answer = got;
        } );

      populatePromises.push(p);
    }

    await Promise.all(populatePromises);

    return entity;
  }

  async findAll(_options?: RepoFindOptions): Promise<QuestionAnswerEntity[]> {
    const docs: QuestionAnswerDocument[] = await this.QuestionAnswerModel.find().exec();

    return docs.map(docToEntity);
  }
}
