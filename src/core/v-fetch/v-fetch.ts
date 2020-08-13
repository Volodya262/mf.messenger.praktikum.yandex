import {queryStringify} from "./query-stringify";
import {VResponse} from "./types/v-response";
import {BaseOptions} from "./types/base-options";
import {METHODS} from "./types/methods";
import {VOptions} from "./types/v-options";

/**
 * Http транспорт
 */
export class VFetch {
    baseOptions: BaseOptions;

    constructor(options: BaseOptions) {
        if (typeof options.baseUrl !== 'string') {
            throw new Error(`Failed to create vFetch: expected baseUrl:string, but got ${options.baseUrl}`);
        }

        this.baseOptions = options;
    }

    mergeOptions<T>(options: Partial<VOptions<T>>): Partial<VOptions<T>> & BaseOptions {
        return {...options, ...this.baseOptions}
    }

    vGet<TReq, TResp>(url: string, options: Partial<VOptions<TReq>> = {method: METHODS.GET}): Promise<VResponse<TResp>> {
        const allOptions = this.mergeOptions(options);
        return this.vRequest<TReq, TResp>(this.baseOptions.baseUrl + url, {
            ...allOptions,
            method: METHODS.GET
        }, options.timeout);
    }

    vPost<TReq, TResp>(url: string, options: Partial<VOptions<TReq>> = {method: METHODS.POST}): Promise<VResponse<TResp>> {
        const allOptions = this.mergeOptions(options);
        return this.vRequest<TReq, TResp>(this.baseOptions.baseUrl + url, {
            ...allOptions,
            method: METHODS.POST
        }, options.timeout);
    }

    vPut<TReq, TResp>(url: string, options: Partial<VOptions<TReq>> = {method: METHODS.PUT}): Promise<VResponse<TResp>> {
        const allOptions = this.mergeOptions(options);
        return this.vRequest<TReq, TResp>(this.baseOptions.baseUrl + url, {
            ...allOptions,
            method: METHODS.PUT
        }, options.timeout);
    }

    vDelete<TReq, TResp>(url: string, options: Partial<VOptions<TReq>> = {method: METHODS.DELETE}): Promise<VResponse<TResp>> {
        const allOptions = this.mergeOptions(options);
        return this.vRequest<TReq, TResp>(this.baseOptions.baseUrl + url, {
            ...allOptions,
            method: METHODS.DELETE
        }, options.timeout);
    }

    private vRequest<TReq, TResp>(url: string, options: BaseOptions & VOptions<TReq> = {method: METHODS.GET}, timeout = 5000): Promise<VResponse<TResp>> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            let requestUrl = url;
            if (options.query && options.method === METHODS.GET) {
                requestUrl += queryStringify(options.query);
            }
            xhr.withCredentials = true;
            xhr.open(options.method, requestUrl);
            if (options.headers) {
                const {headers} = options;
                for (const key in headers) {
                    if (Object.prototype.hasOwnProperty.call(headers, key)) {
                        xhr.setRequestHeader(key, headers[key]);
                    }
                }
            }

            xhr.onload = function onl() {
                let responseData: TResp;
                try {
                    responseData = JSON.parse(xhr.response);
                } catch {
                    responseData = xhr.response;
                }

                const response: VResponse<TResp> = {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    data: responseData,
                };
                if (String(xhr.status).startsWith('2')) {
                    return resolve(response);
                }

                return reject(response);
            };

            xhr.timeout = timeout;
            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;
            if (options.method === METHODS.GET) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(options.data));
            }
        })
    }
}
