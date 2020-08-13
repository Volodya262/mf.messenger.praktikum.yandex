import {v4 as uuid} from 'uuid';

/**
 * Создает уникальный id, гарантирует уникальность
 */
export function uuidv4(): string {
    return uuid();
}
