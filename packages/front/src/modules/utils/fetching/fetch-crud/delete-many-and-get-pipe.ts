import { RemoveManyDto, ResultManyDto } from "#shared/utils/dtos";
import { validateOrReject } from "class-validator";
import { validateOkResponse } from "../error-handling";
import { FetchPipe, createFetchPipe } from "../fetch-pipe";
import { UnknownEntity } from "./utils";

type CreateFetchPipeDeleteManyAndGetProps = {
  url: string;
};
export function createFetchPipeDeleteManyAndGet<ENTITY extends UnknownEntity>(
  props: CreateFetchPipeDeleteManyAndGetProps,
): FetchPipe<ResultManyDto<ENTITY>, RemoveManyDto<ENTITY["id"]>> {
  const { url } = props;

  return createFetchPipe<
    ResultManyDto<ENTITY>,
    RemoveManyDto<ENTITY["id"]>
  >( {
    preFetchValidation: validateOrReject,
    fetchFn: (dto) => {
      return fetch(url, {
        method: "DELETE",
        body: JSON.stringify(dto),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      } );
    },
    postFetchValidation: validateOkResponse,
    transform: (res) => res.json(),
    postValidation: validateOrReject,
  } );
}
