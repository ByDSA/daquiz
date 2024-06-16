import { TextAnswerEntity } from "../../../models";
import { PatchOneTextAnswerDto } from "./crud.dto";
import { createFetchPipePatchOneAndGet } from "#utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/answers/text";

export const { useFetch: usePatchOneTextAnswerAndGet } = createFetchPipePatchOneAndGet<
TextAnswerEntity, PatchOneTextAnswerDto
>( {
  entityUrl: URL,
} );
