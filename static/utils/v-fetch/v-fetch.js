import { queryStringify } from "./query-stringify";
const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};
// если честно, я кроме get в этом классе ничего не проверял.
// честного хождения в сеть в проекте пока нет
export class vFetch {
    /**
     *
     * @param url
     * @param queryParams
     */
    vGet(url, queryParams = null) {
        return new Promise((resolve, reject) => {
            const xhr = this.createDefaultXhr(resolve, reject);
            const paramsString = queryParams != null ? queryStringify(queryParams) : '';
            xhr.open(METHODS.GET, url + paramsString);
            xhr.send();
        });
    }
    vPost(url, bodyParams) {
        return new Promise((resolve, reject) => {
            const xhr = this.createDefaultXhr(resolve, reject);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.open(METHODS.POST, url);
            xhr.send(JSON.stringify(bodyParams || {}));
        });
    }
    vPut(url, queryParams, bodyParams) {
        return new Promise((resolve, reject) => {
            const xhr = this.createDefaultXhr(resolve, reject);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const paramsString = queryParams != null ? queryStringify(queryParams) : '';
            xhr.open(METHODS.PUT, url + paramsString);
            xhr.send(JSON.stringify(bodyParams || {}));
        });
    }
    vDelete(url, queryParams) {
        return new Promise((resolve, reject) => {
            const xhr = this.createDefaultXhr(resolve, reject);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const paramsString = queryParams != null ? queryStringify(queryParams) : '';
            xhr.open(METHODS.DELETE, url + paramsString);
            xhr.send();
        });
    }
    createDefaultXhr(resolve, reject) {
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
//# sourceMappingURL=v-fetch.js.map