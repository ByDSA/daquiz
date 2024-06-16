import urlJoin from "#shared/utils/urls/urlJoin";
import { assertDefined } from "#shared/utils/validation/asserts";
import { UnknownAnswerVO } from "#modules/answers";
import { QuestionAnswerID } from "#modules/questions-answers";
import { UseMutation, checkForErrors, createApi } from "#utils/fetching";

type Props = {
  questionAnswerId: QuestionAnswerID;
  answer: UnknownAnswerVO;
};
type CheckAnswerResult = {
  isCorrect: boolean;
};

const api = createApi( {
  baseUrl: urlJoin(process.env.NEXT_PUBLIC_BACKEND_URL as string, "questions-answers", "checking"),
  endpoints: (build) => ( {
    checkAnswer: build.mutation<CheckAnswerResult, Props, Pick<Props, "answer">>( {
      query: ( { questionAnswerId, answer } ) => ( {
        url: questionAnswerId,
        method: "POST",
        body: {
          answer,
        },
      } ),
      responseHandler: async (res: Response) => {
        const resJson = await res.json();

        checkForErrors(res, resJson);
        const { isCorrect } = resJson;

        assertDefined(isCorrect);

        return resJson;
      },
    } ),
  } ),
} );

export const useCheckAnswerMutation = (api as any)
  .useCheckAnswerMutation as UseMutation<CheckAnswerResult, Props>;
