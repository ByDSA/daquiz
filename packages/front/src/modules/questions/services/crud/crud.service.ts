import { QuestionEntity } from "../../models";
import { PatchOneQuestionDto } from "./crud.dto";
import { createFetchPipePatchOneAndGet } from "#utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/questions";

export const { useFetch: usePatchOneQuestionAndGet } = createFetchPipePatchOneAndGet<
QuestionEntity, PatchOneQuestionDto
>( {
  entityUrl: URL,
} );
