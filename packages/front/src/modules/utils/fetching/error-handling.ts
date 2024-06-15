import { ResultCommon } from "#shared/utils/dtos";

export function checkForErrors(response: Response, responseJson?: ResultCommon) {
  if (!response.ok) {
    throw new Error(responseJson?.message, {
      cause: responseJson ?? response,
    } );
  }
}

// eslint-disable-next-line require-await
export async function validateOkResponse(response: Response) {
  if (!response.ok) {
    throw new Error("Response is not ok", {
      cause: response,
    } );
  }
}
