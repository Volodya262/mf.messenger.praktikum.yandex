/**
 * Определяет, является аргумент объектом или примитивным типом. Null не считается объектом.
 * @param obj
 */
export function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
}
//# sourceMappingURL=common-utils.js.map