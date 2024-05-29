import { AnswerType } from "#shared/models/answers/Answer";
import { TextAnswerEntity, TextAnswerID, TextAnswerVO } from "#shared/models/answers/text-answers/TextAnswer";
import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity, QuestionID, QuestionVO } from "#shared/models/questions/Question";
import { QuestionAnswerInQuizEntity, questionAnswerEntityToQuestionAnswerInQuizEntity } from "#shared/models/quizzes/QuestionAnswerInQuiz";
import { QuizEntity, QuizID } from "#shared/models/quizzes/Quiz";
import { AddQuestionsAnswersDto, CreateQuizDto } from "#shared/models/quizzes/dtos";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import extend from "just-extend";
import { Model } from "mongoose";
import { QuestionAnswerInQuizDocument, Quiz, questionAnswerInQuizEntityToDocument, quizDocumentToEntity } from "./db";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";
import { QuestionsAnswersService } from "#/questions-answers/services";
import { EventDBEmitter } from "#/events/EventDBEmitter";

@Injectable()
export class QuizzesService implements
CreateOneAndGetService<CreateQuizDto, QuizEntity>,
FindOneService<QuizEntity>,
FindAllService<QuizEntity> {
  constructor(
    @InjectModel(Quiz.name) private QuizModel: Model<Quiz>,
    private readonly questionsAnswersService: QuestionsAnswersService,
    private readonly dbEventEmitter: EventDBEmitter,
  ) {
    this.dbEventEmitter.onPatch(
      QuestionEntity,
      (event) => {
        if (event.partialValueObject)
          this.#patchQuestionReference(event.id, event.partialValueObject);
      },
    );

    this.dbEventEmitter.onPatch(
      TextAnswerEntity,
      (event) => {
        if (event.partialValueObject)
          this.#patchTextAnswerReference(event.id, event.partialValueObject);
      },
    );
  }

  async createOneAndGet(dto: CreateQuizDto): Promise<QuizEntity> {
    const doc = new this.QuizModel(dto);
    const createdDoc = await doc.save();

    if (!createdDoc)
      throw new Error("Failed to create quiz");

    return quizDocumentToEntity(createdDoc);
  }

  async #patchQuestionReference(id: QuestionID, partialVO: Partial<QuestionVO>) {
    const quizzes = await this.findAll();

    for (const quiz of quizzes) {
      quiz.questionAnswers ??= [];
      let haveToUpdateQuiz = false;

      for (const questionAnswer of quiz.questionAnswers) {
        if (questionAnswer.questionId === id && questionAnswer.question) {
          questionAnswer.question = extend(
            {},
            questionAnswer.question,
            partialVO,
          ) as QuestionVO;
          questionAnswer.questionId = id;
          haveToUpdateQuiz = true;
        }
      }

      if (haveToUpdateQuiz)
        await this.#updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  async #patchTextAnswerReference(id: TextAnswerID, valueObject: Partial<TextAnswerVO>) {
    const quizzes = await this.findAll();

    for (const quiz of quizzes) {
      quiz.questionAnswers ??= [];
      let haveToUpdateQuiz = false;

      for (const questionAnswer of quiz.questionAnswers) {
        if (questionAnswer.answerType === AnswerType.TEXT
          && questionAnswer.answerId === id
          && questionAnswer.answer) {
          questionAnswer.answer = extend(
            true,
            {},
            questionAnswer.answer,
            valueObject,
          ) as TextAnswerVO;
          questionAnswer.answerId = id;
          haveToUpdateQuiz = true;
        }
      }

      if (haveToUpdateQuiz)
        await this.#updateOneQuestionsAnswers(quiz.id, quiz.questionAnswers);
    }
  }

  async #updateOneQuestionsAnswers(id: QuizID, questionsAnswers: QuestionAnswerInQuizEntity[]) {
    const result = await this.QuizModel.updateOne( {
      _id: id,
    }, {
      questionsAnswers: questionsAnswers.map(qa=> questionAnswerInQuizEntityToDocument(qa)),
    } ).exec();

    return result;
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
    const questionsAnswersDocs: QuestionAnswerInQuizDocument[] = [];

    for (const questionAnswerId of dto.questionsAnswersIds) {
      const questionAnswerEntity = await this.questionsAnswersService.findOne(questionAnswerId, {
        includeRelations: {
          question: true,
          answer: true,
        },
      } );

      if (!questionAnswerEntity)
        throw new BadRequestException("Failed to find question answer");

      const questionAnswerInQuizEntity = questionAnswerEntityToQuestionAnswerInQuizEntity(
        questionAnswerEntity,
      );
      const doc = questionAnswerInQuizEntityToDocument(questionAnswerInQuizEntity);

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

  async removeOneQuestionAnswer(
    id: QuizID,
    questionAnswerId: QuestionAnswerID,
  ): Promise<QuizEntity> {
    const doc = await this.QuizModel.findByIdAndUpdate(id, {
      $pull: {
        questionsAnswers: {
          _id: questionAnswerId,
        },
      },
    } ).exec();

    if (!doc)
      throw new BadRequestException("Failed to remove question answer");

    return quizDocumentToEntity(doc);
  }
}
