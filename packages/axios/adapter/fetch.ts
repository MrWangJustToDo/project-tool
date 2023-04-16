import { FetchTimeOutError } from "./error";

export const generateFetchWithTimeout = (timeout?: number) => {
  return async (...props: Parameters<typeof fetch>) => {
    const abort = new AbortController();

    const request = () => fetch(props[0], { ...props[1], signal: abort.signal });

    setTimeout(() => abort.abort(`[fetch] ${timeout} ms timeout to fetch`), timeout);

    return await request();
  };
};
