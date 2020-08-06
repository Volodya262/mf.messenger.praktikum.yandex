import {isObject} from "../../common/utils/common-utils";

// TODO добавить спец. обработчик для Date
// TODO скорее всего надо будет делать экранирование для спец.символов
export function queryStringify(obj: Record<string, unknown>): string {
    if (!isObject(obj)) {
        throw new Error(`Expected object, but got ${obj}`);
    }

    const entries = Object.entries(obj);

    if (entries.length > 0) {
        return entries.reduce((acc, [key, value], index) => {
            if (index > 0) {
                acc += '&'
            }

            if (Array.isArray(value)) {
                return acc + value.reduce((acc, arrValue, arrIndex) => acc += `${arrIndex > 0 ? '&' : ''}${key}[${arrIndex}]=${arrValue}`, '')
            }

            if (typeof value === 'object') {
                return acc + transformObjectEntriesToArrayString(key, value)
            }

            return acc + `${key}=${value}`
        }, '?')
    }

    return '';
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