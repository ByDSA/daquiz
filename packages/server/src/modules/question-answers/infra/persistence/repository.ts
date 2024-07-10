import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionAnswerEntity, QuestionAnswerID } from "../../domain";
import { CreateQuestionAnswerDto } from "../domain";
import { docToEntity } from "./adapters";
import { Repo } from "./repository.port";
import { QuestionAnswer, QuestionAnswerDocument } from "./schema";
import { Question } from "#modules/questions/infra/persistence/repos/schemas";
import { PartType, QuestionRepo, TextPart, findChoices, findFirstTextPart } from "#modules/questions";
import { TextAnswer } from "#modules/answers/submodules/text-answer/infra/persistence/repos/schemas/schema";
import { TextAnswerRepo, TextAnswerVO } from "#modules/answers/submodules/text-answer";

@Injectable()
export class RepoImp implements Repo {
  constructor(
    @InjectModel(QuestionAnswer.name) private readonly QuestionAnswerModel: Model<QuestionAnswer>,
    @InjectModel(Question.name) private readonly QuestionModel: Model<Question>,
    @InjectModel(TextAnswer.name) private readonly TextAnswerModel: Model<TextAnswer>,
    @Inject(QuestionRepo) private readonly questionRepo: QuestionRepo,
    @Inject(TextAnswerRepo) private readonly textAnswerRepo: TextAnswerRepo,
  ) {}

  async createOneAndGet(dto: CreateQuestionAnswerDto): Promise<QuestionAnswerEntity> {
    if (dto.answer.type !== "text")
      throw new Error("Unsupported answer type");

    const choices = findChoices(dto.question);
    const text = findFirstTextPart(dto.question)?.text;
    const choicesDto = choices.length > 0
      ? (choices.filter(c=>c.type === PartType.Text)).map((c: TextPart)=> {
        return {
          text: c.text,
        };
      } )
      : undefined;

    if (!choicesDto && !text)
      throw new Error("No choices or text found in the question");

    const questionDocInput: Question = {
      choices: choicesDto,
      text,
    };
    const answerDocInput: TextAnswer = {
      text: (dto.answer as TextAnswerVO).text,
    };
    const questionDocGot = await this.QuestionModel.create(questionDocInput);
    const answerDocGot = await this.TextAnswerModel.create(answerDocInput);
    let created = new this.QuestionAnswerModel( {
      questionId: questionDocGot.id,
      answerId: answerDocGot.id,
      answerType: "text",
    } );

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
