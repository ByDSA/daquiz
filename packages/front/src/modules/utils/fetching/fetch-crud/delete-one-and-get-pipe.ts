import { ResultOneDto } from "#shared/utils/dtos";
import { validateOrReject } from "class-validator";
import { assertDefined } from "../../../../../../shared/build/utils/validation/asserts";
import { validateOkResponse } from "../error-handling";
import { FetchPipe, createFetchPipe } from "../fetch-pipe";
import { UnknownEntity } from "./utils";

type CreateFetchPipeDeleteOneAndGetProps = {
  url: string;
};
export function createFetchPipeDeleteOneAndGet<ENTITY extends UnknownEntity>(
  props: CreateFetchPipeDeleteOneAndGetProps,
): FetchPipe<ResultOneDto<ENTITY>, ENTITY["id"]> {
  const { url: entityUrl } = props;

  return createFetchPipe<
    ResultOneDto<ENTITY>,
    ENTITY["id"]
  >( {
    // eslint-disable-next-line require-await
    preFetchValidation: async (id) => {
      assertDefined(id, "id is required");
    },
    fetchFn: (id) => {
      const url = entityUrl + "/" + id;

      return fetch(url, {
        method: "DELETE",
      } );
    },
    postFetchValidation: validateOkResponse,
    transform: (res) => res.json(),
    postValidation: validateOrReject,
  } );
}
