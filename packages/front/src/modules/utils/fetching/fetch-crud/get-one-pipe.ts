import { ResultOneDto } from "#shared/utils/dtos";
import { validateOrReject } from "class-validator";
import { validateOkResponse } from "../error-handling";
import { FetchPipeQuery, createFetchPipeQuery } from "../fetch-pipe";
import { UnknownEntity } from "./utils";

type CreateFetchPipeGetOneProps = {
  url: string;
};
type CreateFetchPipeGetOneFetchFnProps<ENTITY extends UnknownEntity> = {
  id: ENTITY["id"];
};
export function createFetchPipeGetOne<ENTITY extends UnknownEntity>(
  props: CreateFetchPipeGetOneProps,
): FetchPipeQuery<ResultOneDto<ENTITY>, CreateFetchPipeGetOneFetchFnProps<ENTITY>> {
  return createFetchPipeQuery<ResultOneDto<ENTITY>, CreateFetchPipeGetOneFetchFnProps<ENTITY>>( {
    url: (params) => `${props.url}/${params.id}`,
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
