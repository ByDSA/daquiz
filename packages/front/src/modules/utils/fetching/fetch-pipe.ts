import { useEffect, useState } from "react";
import useSWR from "swr";

type CreateFetchPipeProps<R = Response, PARAMS = void> = {
  id?: string;
  preFetchValidation?: (params: PARAMS)=> Promise<void>;
  fetchFn: (params: PARAMS)=> Promise<Response>;
  postFetchValidation?: (res: Response)=> Promise<void>;
  transform?: (res: Response)=> Promise<R>;
  postValidation?: (res: R)=> Promise<void>;
};
type UseFetchRet<R, P> = [(params: P)=> Promise<void>, R | undefined];
type UseFetch<R, P> = ()=> UseFetchRet<R, P>;

export type FetchPipe<R, P> = {
  doFetch: (params: P)=> Promise<R>;
  useFetch: UseFetch<R, P>;
};

export function createFetchPipe<R = Response, P = void>( { fetchFn,
  postValidation,
  postFetchValidation,
  preFetchValidation,
  transform }: CreateFetchPipeProps<R, P>): FetchPipe<R, P> {
  const doFetch = async (params: P) => {
    await preFetchValidation?.(params);
    const res = await fetchFn(params);

    await postFetchValidation?.(res);
    const resAfterTransform: R = (await transform?.(res)) ?? res as R;

    await postValidation?.(resAfterTransform);

    return resAfterTransform;
  };

  return {
    doFetch,
    useFetch: () => {
      const [result, setResult] = useState<R | undefined>(undefined);
      const fn = async (params: P) => {
        const res = await doFetch(params);

        setResult(res);
      };

      return [
        fn,
        result,
      ];
    },
  };
}

type UseQueryRet<R> = {
  data: R | undefined;
  isLoading: boolean;
  error: any;
  revalidate: ()=> Promise<any>;
};
type UseQuery<R, P> = (params: P)=> UseQueryRet<R>;
type CreateFetchPipeQueryProps<R = Response, P = void> = {
  url: (params: P)=> string;
  fetcher: (url: string)=> Promise<Response>;
  postValidation?: (res: R)=> Promise<void>;
  postFetchValidation?: (res: Response)=> Promise<void>;
  preFetchValidation?: (params: P)=> Promise<void>;
  transform?: (res: Response)=> Promise<R>;
};
export type FetchPipeQuery<R, P> = {
  useQuery: UseQuery<R, P>;
};

export function createFetchPipeQuery<
R = Response, P = void
>( { fetcher,
  url,
  postValidation,
  postFetchValidation,
  preFetchValidation,
  transform }: CreateFetchPipeQueryProps<R, P>): FetchPipeQuery<R, P> {
  return {
    useQuery: (params: P) => {
      preFetchValidation?.(params);
      const { data: res, error, isLoading, mutate } = useSWR(url(params), fetcher);
      const [data, setData] = useState<R | undefined>(undefined);

      useEffect(() => {
        (async () => {
          if (!res || res.bodyUsed)
            return;

          await postFetchValidation?.(res);
          const resAfterTransform: R = (await transform?.(res)) ?? res as R;

          await postValidation?.(resAfterTransform);

          setData(resAfterTransform);
        } )();
      }, [res]);

      const revalidate = () => mutate(res);

      return {
        data,
        isLoading,
        error,
        revalidate,
      };
    },
  };
}
