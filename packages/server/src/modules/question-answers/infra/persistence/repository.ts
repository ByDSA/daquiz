import { TextAnswerRepo } from "#modules/answers/submodules/text-answer";
import { QuestionRepo } from "#modules/questions";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionAnswerEntity, QuestionAnswerID } from "../../domain";
import { CreateQuestionAnswerDto } from "../domain";
import { docToEntity } from "./adapters";
import { Repo } from "./repository.port";
import { QuestionAnswer, QuestionAnswerDocument } from "./schema";

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

    return docToEntity(created, {
      questionRepo: this.questionRepo,
      answerRepo: this.textAnswerRepo,
    } );
  }

  async findOne(
    id: QuestionAnswerID,
  ): Promise<QuestionAnswerEntity | null> {
    const doc = await this.QuestionAnswerModel.findById(id).exec();

    if (!doc)
      return null;

    const entity = await docToEntity(doc, {
      questionRepo: this.questionRepo,
      answerRepo: this.textAnswerRepo,
    } );

    return entity;
  }

  async findAll(): Promise<QuestionAnswerEntity[]> {
    const docs: QuestionAnswerDocument[] = await this.QuestionAnswerModel.find().exec();

    return Promise.all(docs.map(d=>docToEntity(d, {
      questionRepo: this.questionRepo,
      answerRepo: this.textAnswerRepo,
    } )));
  }
}
