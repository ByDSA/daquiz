import { createFetchPipePatchOneAndGet } from "#utils/fetching";
import { TextAnswerEntity } from "../../../models";
import { PatchOneTextAnswerDto } from "./crud.dto";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/answers/text";

export const { useFetch: usePatchOneTextAnswerAndGet } = createFetchPipePatchOneAndGet<
TextAnswerEntity, PatchOneTextAnswerDto
>( {
  entityUrl: URL,
} );
