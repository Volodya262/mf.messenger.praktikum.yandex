import {queryStringify} from "./query-stringify";
import {VResponse} from "./types/v-response";
import {InstanceOptions} from "./types/instance-options";
import {METHODS} from "./types/methods";
import {VOptions} from "./types/v-options";

/**
 * Http транспорт
 */
export class VFetch {
    baseOptions: InstanceOptions;

    constructor(instance: InstanceOptions = {baseUrl: ''}) {
        if (typeof instance.baseUrl !== 'string') {
            throw new Error(`Failed to create vFetch: expected baseUrl:string, but got ${instance.baseUrl}`);
        }

        this.baseOptions = instance;
    }

    mergeOptions(options: VOptions): VOptions & InstanceOptions {
        return {...options, ...this.baseOptions}
    }

    vGet(url: string, options: VOptions = {method: METHODS.GET}): Promise<unknown> {
        const allOptions = this.mergeOptions(options);
        return this.vRequest(this.baseOptions.baseUrl + url, {...allOptions, method: METHODS.GET}, options.timeout);
    }

    vPost(url: string, options: VOptions = {method: METHODS.POST}): Promise<unknown> {
        const allOptions = this.mergeOptions(options);
        return this.vRequest(this.baseOptions.baseUrl + url, {...allOptions, method: METHODS.POST}, options.timeout);
    }

    vPut(url: string, options: VOptions = {method: METHODS.PUT}): Promise<unknown> {
        const allOptions = this.mergeOptions(options);
        return this.vRequest(this.baseOptions.baseUrl + url, {...allOptions, method: METHODS.PUT}, options.timeout);
    }

    vDelete(url: string, options: VOptions = {method: METHODS.DELETE}): Promise<unknown> {
        const allOptions = this.mergeOptions(options);
        return this.vRequest(this.baseOptions.baseUrl + url, {...allOptions, method: METHODS.DELETE}, options.timeout);
    }

    private vRequest(url: string, options: InstanceOptions & VOptions = {method: METHODS.GET}, timeout = 5000) {
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
                let responseData: {};
                try {
                    responseData = JSON.parse(xhr.response);
                } catch {
                    responseData = xhr.response;
                }

                const data: VResponse = {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    data: responseData,
                };
                if (String(xhr.status).startsWith('2')) {
                    return resolve(data);
                }

                return reject(data);
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
