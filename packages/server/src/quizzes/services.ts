import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Quiz, quizDocumentToEntity } from "./db";
import { AddQuestionsAnswersDto, CreateQuizDto } from "./dtos";
import { QuizEntity, QuizID } from "./models";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";
import { QuestionsAnswersService } from "#/questions-answers/services";
import { QuestionAnswerDocument, questionAnswerEntityToDocument } from "#/questions-answers/db/schemas";

@Injectable()
export class QuizzesService implements
CreateOneAndGetService<CreateQuizDto, QuizEntity>,
FindOneService<QuizEntity>,
FindAllService<QuizEntity> {
  constructor(
    @InjectModel(Quiz.name) private QuizModel: Model<Quiz>,
    private questionsAnsersService: QuestionsAnswersService,
  ) {}

  async createOneAndGet(dto: CreateQuizDto): Promise<QuizEntity> {
    const doc = new this.QuizModel(dto);
    const createdDoc = await doc.save();

    if (!createdDoc)
      throw new Error("Failed to create quiz");

    return quizDocumentToEntity(createdDoc);
  }

  async findOne(id: string): Promise<QuizEntity | null> {
    const doc = await this.QuizModel.findById(id).exec();

    if (!doc)
      return null;

    return quizDocumentToEntity(doc);
  }

  async findAll(): Promise<QuizEntity[]> {
    const docs = await this.QuizModel.find().exec();

    if (!docs)
      throw new Error("Failed to find quizzes");

    return docs.map(quizDocumentToEntity);
  }

  async addQuestionsAnswers(id: QuizID, dto: AddQuestionsAnswersDto): Promise<QuizEntity> {
    const questionsAnswersDocs: QuestionAnswerDocument[] = [];

    for (const questionAnswerId of dto.questionsAnswersIds) {
      const questionAnswerEntity = await this.questionsAnsersService.findOne(questionAnswerId, {
        includeRelations: {
          question: true,
          answer: true,
        },
      } );

      if (!questionAnswerEntity)
        throw new BadRequestException("Failed to find question answer");

      const doc = questionAnswerEntityToDocument(questionAnswerEntity);

      questionsAnswersDocs.push(doc);
    }

    const doc = await this.QuizModel.findByIdAndUpdate(id, {
      $push: {
        questionsAnswers: questionsAnswersDocs,
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to add questions answers");

    return quizDocumentToEntity(doc);
  }
}
