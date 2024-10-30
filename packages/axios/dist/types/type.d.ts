import type { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
export type RequestInterceptor = Parameters<AxiosInterceptorManager<InternalAxiosRequestConfig>["use"]>[];
export type ResponseInterceptor = Parameters<AxiosInterceptorManager<AxiosResponse>["use"]>[];
export type BaseCreateOptions = AxiosRequestConfig & {
    requestInterceptors?: RequestInterceptor;
    responseInterceptors?: ResponseInterceptor;
};
//# sourceMappingURL=type.d.ts.map