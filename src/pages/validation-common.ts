import {inputErrorMessagesListTemplate} from "./common/templates/input-error-message";
import Handlebars from 'handlebars'

export const PASSWORD_LENGTH_MIN = 8;
export const PASSWORD_LENGTH_MAX = 32;

export function toggleInputValid(element: HTMLElement, errors: string[]): void {
    if (element == null) {
        return;
    }

    if (errors == null || errors.length === 0) {
        element.classList.remove('input__has-error');
    } else {
        element.classList.add('input__has-error');
    }
}

export function showErrorsInContainer(containerId: string, errors: string[]): void {
    if (errors?.length === 0) {
        return;
    }

    const template = Handlebars.compile(inputErrorMessagesListTemplate);
    const context = {errors: errors};

    document.getElementById(containerId).innerHTML = template(context);
}

export function hasErrors(arr: string[]): boolean {
    return arr != null && arr.length > 0;
}

export function hasNoErrors(arr: string[]): boolean {
    return arr == null || arr.length === 0;
}

/**
 * Валидация логина. Возвращает список ошибок
 */
export function validateLogin(login: string): string[] {
    if (login == null || login.length === 0) {
        return [requiredField]
    }

    if (login.indexOf(' ') > -1) {
        return ["Логин не может содержать пробелы"]
    }
}

export function validatePassword(password: string): string[] {
    if (password == null || password.length === 0) {
        return [requiredField]
    }

    if (password.length < PASSWORD_LENGTH_MIN) {
        return [`Пароль должен быть длиннее ${PASSWORD_LENGTH_MIN} символов`]
    }

    if (password.length > PASSWORD_LENGTH_MAX) {
        return [`Пароль должен быть длиннее ${PASSWORD_LENGTH_MAX} символов`]
    }
}

export function showValidateRes(errors: string[], inputElement: HTMLInputElement, errorsContainerId: string): void {
    showErrorsInContainer(errorsContainerId, errors);
    toggleInputValid(inputElement, errors);
}

export const requiredField = "Это поле обязательно для заполнения";

export function escapeXss(s: string): string {
    if (s == null) {
        return s
    }

    const tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return s.replace(/[&<>]/g, function (tag) {
        return tagsToReplace[tag] || tag;
    });
}