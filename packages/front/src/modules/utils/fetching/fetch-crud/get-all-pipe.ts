import { ResultManyDto } from "#shared/utils/dtos";
import { validateOrReject } from "class-validator";
import { validateOkResponse } from "../error-handling";
import { FetchPipeQuery, createFetchPipeQuery } from "../fetch-pipe";
import { UnknownEntity } from "./utils";

type CreateFetchPipeGetAllProps = {
  url: string;
};
export function createFetchPipeGetAll<ENTITY extends UnknownEntity>(
  props: CreateFetchPipeGetAllProps,
): FetchPipeQuery<ResultManyDto<ENTITY>, void> {
  return createFetchPipeQuery<ResultManyDto<ENTITY>>( {
    url: (_params) => props.url,
    fetcher: (url) => {
      return fetch(url, {
        method: "GET",
      } );
    },
    postFetchValidation: validateOkResponse,
    transform: (res) => res.json(),
    postValidation: validateOrReject,
  } );
}
