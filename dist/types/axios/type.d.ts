import type { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from "axios";
export declare type RequestInterceptor = Parameters<AxiosInterceptorManager<AxiosRequestConfig>["use"]>[];
export declare type ResponseInterceptor = Parameters<AxiosInterceptorManager<AxiosResponse>["use"]>[];
export declare type BaseCreateOptions = AxiosRequestConfig & {
    requestInterceptors?: RequestInterceptor;
    responseInterceptors?: ResponseInterceptor;
};
//# sourceMappingURL=type.d.ts.map