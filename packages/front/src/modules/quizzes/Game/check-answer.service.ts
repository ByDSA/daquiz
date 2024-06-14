import { UnknownAnswerVO } from "#shared/models/answers/unknown-answers/UnknownAnswer";
import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import urlJoin from "../../../../../shared/build/utils/urls/urlJoin";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";
import { UseMutation, checkForErrors, createApi } from "#modules/utils/fetching";

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
