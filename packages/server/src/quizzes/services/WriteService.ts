import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuizEntity, QuizID } from "#shared/models/quizzes/Quiz";
import { AddQuestionsAnswersDto, CreateQuizDto } from "#shared/models/quizzes/dtos";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Quiz, quizDocToEntity } from "../db";
import { CreateOneAndGetService } from "#/utils/services/crud";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class QuizzesWriteService implements
CreateOneAndGetService<CreateQuizDto, QuizEntity> {
  constructor(
    @InjectModel(Quiz.name) private QuizModel: Model<Quiz>,
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    this.dbEventEmitter.onPatch(QuizEntity, (event) => {
      console.log(QuizEntity.name, "PATCH", event);
    } );

    this.dbEventEmitter.onDelete(QuizEntity, (event) => {
      console.log(QuizEntity.name, "DELETE", event);
    } );

    this.dbEventEmitter.onCreate(QuizEntity, (event) => {
      console.log(QuizEntity.name, "CREATE", event);
    } );
  }

  async createOneAndGet(dto: CreateQuizDto): Promise<QuizEntity> {
    const doc = new this.QuizModel(dto);
    const createdDoc = await doc.save();

    if (!createdDoc)
      throw new Error("Failed to create quiz");

    const entity = quizDocToEntity(createdDoc);

    return entity;
  }

  async addManyQuestionsAnswers(id: QuizID, dto: AddQuestionsAnswersDto): Promise<void> {
    const doc = await this.QuizModel.findByIdAndUpdate(id, {
      $addToSet: {
        questionsAnswers: {
          $each: dto.questionsAnswersIds,
        },
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to add questions answers");
  }

  async removeOneQuestionAnswer(
    id: QuizID,
    questionAnswerId: QuestionAnswerID,
  ): Promise<void> {
    const doc = await this.QuizModel.findByIdAndUpdate(id, {
      $pull: {
        questionsAnswers: questionAnswerId,
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to remove question answer");
  }

  async removeManyQuestionsAnswers(
    id: QuizID,
    questionAnswerIds: QuestionAnswerID[],
  ): Promise<void> {
    const doc = await this.QuizModel.findByIdAndUpdate(id, {
      $pull: {
        questionsAnswers: {
          $in: questionAnswerIds,
        },
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to remove question answer");
  }
}
