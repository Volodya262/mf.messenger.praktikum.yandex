/**
 * [1, 2, 3, 4] => 1
 */
export function first(list) {
    if (list == null || !Array.isArray(list)) { // о проверках на null описано в "О проверках на null.md"
        return undefined;
    }

    if (list.length === 0) {
        return undefined;
    }

    return list[0]
}

/**
 * Группировка данных по ключу. Ключ сравниваются через ===. Возвращает js Map.
 * @param arr Данные
 * @param keySelector Селектор ключа
 */
export function groupBy(arr, keySelector) {
    return arr.reduce((groups, item) => {
        const key = keySelector(item);
        if (groups.has(key)) {
            const groupItem = groups.get(key);
            if (groupItem == null) {
                throw new Error('Unexpected error occured');
            }
            groupItem.push(item);
        } else {
            groups.set(key, [item]);
        }

        return groups;
    }, new Map())
}

/**
 * Группировка данных по ключу. Ключ сравниваются через ===. Возвращает массив объектов {ключ, значения}.
 * @param arr Данные
 * @param keySelector Селектор ключа
 */
export function groupByAsArray(arr, keySelector) {
    const map = groupBy(arr, keySelector);
    const res = [];
    map.forEach((values, key) => res.push({key: key, items: values}));
    return res;
}

export function last(list) {
    if (list == null || !Array.isArray(list)) {
        return undefined;
    }

    if (list.length === 0) {
        return undefined;
    }

    return list[list.length - 1]
}

export function rangeRight(start, end, step) {
    return range(start, end, step, true);
}

export function range(start, end, step, isRight) {
    const res = [];

    if (start == null) {
        return [];
    }

    if (end == null) {
        end = start;
        start = 0;
    }

    if (step == null) {
        step = end > start ? 1 : -1;
    }

    if (isRight == null) {
        isRight = false;
    }

    if (step === 0) {
        for (let counter = start; Math.abs(end - counter) > 0; ++counter) {
            res.push(start);
        }

        return res;
    }

    for (let i = start; Math.abs(end - i) > 0; i += step) {
        if (!isRight) {
            res.push(i);
        } else {
            res.unshift(i);
        }
    }

    return res;
}

/**
 * Сортировка массива объектов по ключу
 * @param arr Массив
 * @param keySelector Селектор ключа
 * @param compareFn Функция сравнения ключей
 */
export function sortBy(arr, keySelector, compareFn) {
    // todo подумать над уменьшением сложности алгоритма
    const res = [];
    const sortedKeys = arr.map(keySelector).sort(compareFn);
    for (const key of sortedKeys) {
        // ловим ситуацию, когда у элементов одинаковый ключ, например два сообщения пришли в одну секунду
        const items = arr.filter(item => keySelector(item) === key);
        if (items == null) {
            throw new Error('Unexpected error occured');
        }
        res.push(...items);
    }

    return res;
}

/**
 * Делит массив на массив массивов в соответствии с предикатом.
 * Например, можно разделить [1,2,3,-1,2,2,-1] на [1,2,3],[-1,2,2],[-1] если предикат currEl => currEl === -1
 * ИЛИ
 * [1,2,3,5,10,11,12,14] на [[1,2,3],[5],[10,11,12],[14]] если предикат (currEl, prevEl) => Math.abs(prevEl - currEl) > 1
 * @param arr Исходный массив
 * @param splitPredicate Предикат разделения. Если выполняется, то текущий элемент будет положен в следующую коллекцию.
 */
export function splitByPredicate(arr, splitPredicate) {
    if (arr.length === 0) {
        return [];
    }

    let currGroup = [arr[0]];
    const res = [currGroup];
    for (let i = 1; i < arr.length; ++i) {
        if (splitPredicate(arr[i], arr[i - 1])) {
            currGroup = [arr[i]];
            res.push(currGroup);
        } else {
            currGroup.push(arr[i]);
        }
    }

    return res;
}

/**
 * Пытается спарсить Number. Если получается NaN, то возвращает null
 * @param src
 */
export function tryParseNumber(src) {
    if (typeof src === "number") {
        return src;
    }

    try {
        if (src != null) {
            const res = Number(src);
            return isNaN(res) ? null : res;
        }
    } catch {
        return null;
    }

    return null;
}

export function maxBy(arr, keySelector, compareFn) {
    if (arr.length === 0) {
        throw new Error('Expected non-empty array')
    }
    let currMax = arr[0];
    let currMaxKey = keySelector(currMax);
    for (let i = 1; i < arr.length; ++i) {
        const currKey = keySelector(arr[i]);
        if (compareFn(currKey, currMaxKey) > 0) {
            currMax = arr[i];
            currMaxKey = currKey;
        }
    }

    return currMax;
}