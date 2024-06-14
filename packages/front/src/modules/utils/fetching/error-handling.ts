import { ResultCommon } from "#shared/utils/dtos";

export function checkForErrors(response: Response, responseJson?: ResultCommon) {
  if (!response.ok) {
    throw new Error(responseJson?.message, {
      cause: responseJson ?? response,
    } );
  }
}
