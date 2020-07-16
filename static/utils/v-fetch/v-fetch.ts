import {queryStringify} from "./query-stringify.js";

const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

// если честно, я кроме get в этом классе ничего не проверял.
// честного хождения в сеть в проекте пока нет
export class vFetch {
    /**
     *
     * @param url
     * @param queryParams
     */
    vGet<T>(url: string, queryParams: object = null): Promise<T> { // TODO добавить функционал хедеров и опционального таймаута
        return new Promise<T>((resolve, reject) => {
            const xhr = this.createDefaultXhr(resolve, reject);

            const paramsString = queryParams != null ? queryStringify(queryParams) : '';

            xhr.open(METHODS.GET, url + paramsString);
            xhr.send();
        })
    }

    vPost<T>(url: string, bodyParams: object): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const xhr = this.createDefaultXhr(resolve, reject);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

            xhr.open(METHODS.POST, url);
            xhr.send(JSON.stringify(bodyParams || {}));
        })
    }

    vPut<T>(url: string, queryParams: object, bodyParams: object): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const xhr = this.createDefaultXhr(resolve, reject);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const paramsString = queryParams != null ? queryStringify(queryParams) : '';

            xhr.open(METHODS.PUT, url + paramsString);
            xhr.send(JSON.stringify(bodyParams || {}));
        })
    }

    vDelete<T>(url: string, queryParams: object): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const xhr = this.createDefaultXhr(resolve, reject);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const paramsString = queryParams != null ? queryStringify(queryParams) : '';
            xhr.open(METHODS.DELETE, url + paramsString);
            xhr.send();
        })
    }

    private createDefaultXhr<T>(resolve: (value?: (T | PromiseLike<T>)) => void, reject: (reason?: any) => void): XMLHttpRequest {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 60000;
        xhr.onload = () => resolve(JSON.parse(xhr.response));
        const handleError = err => reject(err);
        xhr.onabort = handleError;
        xhr.onerror = handleError;
        xhr.ontimeout = handleError;

        return xhr;
    }
}