import useSWR, { mutate } from "swr";
import urlJoin from "../../../../../shared/build/utils/urls/urlJoin";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";

export type UseDataRet<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
  revalidate: ()=> Promise<any>;
};
type Fetcher<T> = (url: string)=> Promise<T>;
export function generateFetcher<T>(): Fetcher<T> {
  return async (url: string) => {
    const res = await fetch(url);

    return await res.json();
  };
}
type UseData<T> = ()=> UseDataRet<T>;
export function generateUseData<T extends {data?: unknown}>(url: string, fetcher: Fetcher<T>): UseData<T["data"]> {
  return () => {
    const { data: response, error, isLoading } = useSWR(url, fetcher);
    const revalidate = () => mutate(url);

    return {
      data: response?.data,
      isLoading,
      error,
      revalidate,
    };
  };
}

type UseDataWithId<T> = (id: string)=> ReturnType<UseData<T>>;
export function generateUseDataWithId<T extends {data?: unknown}>(url: string, fetcher: Fetcher<T>): UseDataWithId<T["data"]> {
  return (id: string) => {
    assertDefined(id, "id is required");
    const actualUrl = urlJoin(url, id);
    const { data: response, error, isLoading } = useSWR(actualUrl, fetcher);
    const revalidate = () => mutate(actualUrl);

    return {
      data: response?.data,
      isLoading,
      error,
      revalidate,
    };
  };
}
