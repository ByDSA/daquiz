import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuizEntity, QuizID } from "#shared/models/quizzes/Quiz";
import { CreateQuizDto, ResultManyQuizDto, ResultOneQuizDto } from "#shared/models/quizzes/dtos";
import { UseMutation, UseQuery, createApi, responseNoDataHandler, responseWithDataHandler } from "#modules/utils/fetching";

type AddQuestionAnswerQuery = {
  quizId: QuizID;
  questionsAnswersIds: QuestionAnswerID[];
};
type AddQuestionAnswerDto = Pick<AddQuestionAnswerQuery, "questionsAnswersIds">;

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/quizzes";
const api = createApi( {
  baseUrl: URL,
  endpoints: (builder) => ( {
    getAllQuizzes: builder.query<ResultManyQuizDto, void>( {
      responseHandler: responseWithDataHandler,
    } ),
    getQuiz: builder.query<ResultOneQuizDto, QuizID>( {
      query: (id) => `/${id}`,
      responseHandler: responseWithDataHandler,
    } ),
    createOneQuizAndGet: builder.mutation<ResultOneQuizDto, CreateQuizDto>( {
      query: (dto) => ( {
        method: "POST",
        body: dto,
      } ),
      responseHandler: responseWithDataHandler,
    } ),
    addQuestionAnswer: builder.mutation<
    void,
    AddQuestionAnswerQuery,
    AddQuestionAnswerDto
    >( {
      query: (dto) => ( {
        url: `${dto.quizId}/add`,
        method: "POST",
        body: {
          questionsAnswersIds: dto.questionsAnswersIds,
        },
      } ),
      responseHandler: responseNoDataHandler,
    } ),
    removeOneQuestionAnswer: builder.mutation<void, {
      quizId: QuizID;
      questionAnswerId: QuestionAnswerID;
    }>( {
      query: (props) => ( {
        url: `${props.quizId}/remove/${props.questionAnswerId}`,
        method: "DELETE",
      } ),
      responseHandler: responseNoDataHandler,
    } ),
    removeManyQuestionAnswer: builder.mutation<void, {
      quizId: QuizID;
      ids: QuestionAnswerID[];
    }, {
      ids: QuestionAnswerID[];
    }>( {
      query: (props) => ( {
        url: `${props.quizId}/remove`,
        method: "DELETE",
        body: {
          ids: props.ids,
        },
      } ),
      responseHandler: responseNoDataHandler,
    } ),
  } ),
} );

export const useQuizzes = (api as any).useGetAllQuizzesQuery as UseQuery<QuizEntity[], void>;

export const useQuiz = (api as any).useGetQuizQuery as UseQuery<QuizEntity, QuizID>;

export const useCreateQuizAndGet = (api as any).useCreateOneQuizAndGetMutation as UseMutation<
QuizEntity, CreateQuizDto
>;

export const useAddQuestionAnswer = (api as any).useAddQuestionAnswerMutation as UseMutation<
AddQuestionAnswerDto, AddQuestionAnswerQuery
>;

export const useRemoveOneQuestionAnswer = (api as any)
  .useRemoveOneQuestionAnswerMutation as UseMutation<
void, {
  quizId: QuizID;
  questionAnswerId: QuestionAnswerID;
}>;

export const useRemoveManyQuestionAnswer = (api as any)
  .useRemoveManyQuestionAnswerMutation as UseMutation<
void, {
  quizId: QuizID;
  ids: QuestionAnswerID[];
}>;