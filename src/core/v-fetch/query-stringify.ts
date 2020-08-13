// TODO скорее всего надо будет делать экранирование для спец.символов
/**
 * Создает строку параметров для url вида ?name=vova&age=15
 * Поддерживает вложенные объекты
 * @param obj
 */
export function queryStringify(obj: {}): string {
    if (typeof obj !== 'object') {
        throw new Error(`Failed to create url params: expected object, but got ${obj}`);
    }

    let result = '?';
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            result += queryStringifyInnerObject(obj[key], key);
        } else {
            result += `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}&`;
        }
    }

    return result.replace(/&$/, '');
}

function queryStringifyInnerObject(obj: {}, querykey: string) {
    let query = '';
    const queryKeySafe = encodeURIComponent(querykey);
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            query += queryStringifyInnerObject(obj[key], `${querykey}[${key}]`);
        } else {
            const safeKey = encodeURIComponent(key);
            const safeValue = encodeURIComponent(obj[key])
            query += `${queryKeySafe}[${safeKey}]=${safeValue}&`;
        }
    }

    return query;
}
