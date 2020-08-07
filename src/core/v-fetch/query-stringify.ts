import {isObject} from "../../common/utils/common-utils";

// TODO добавить спец. обработчик для Date
// TODO скорее всего надо будет делать экранирование для спец.символов
export function queryStringify(obj: {}): string {
    if (typeof obj !== 'object') {
        throw new Error('');
    }

    let result = '?';
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'object') {
                result += queryHelper(obj[key], key);
            } else {
                result += `${key}=${obj[key]}&`;
            }
        }
    }

    return result.replace(/&$/, '');
}

function queryHelper(obj: {}, querykey: string) {
    let query = '';
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'object') {
                query += queryHelper(obj[key], `${querykey}[${key}]`);
            } else {
                query += `${querykey}[${key}]=${obj[key]}&`;
            }
        }
    }

    return query;
}

/**
 * Преобразовывает объект person: {age: 15, cars: {favouriteCar: 'bmw', dailyCar: 'hyundai'}}
 * к виду person[age]=15&person[cars][favouriteCar]='bmw'&person[cars][dailyCar]='huyndai'
 * @param name
 * @param obj
 */
function transformObjectEntriesToArrayString(name, obj): string { // большого смысла я в такой функции не вижу, копирнул из тренажера
    const entries = Object.entries(obj);
    return entries.reduce((acc, [key, value], index) => {
        if (index > 0) {
            acc += '&'
        }

        if (isObject(value)) {
            return acc + transformObjectEntriesToArrayString(`${name}[${key}]`, value)
        }

        return acc + `${name}[${key}]=${value}`;
    }, '')
}
