export const PASSWORD_LENGTH_MIN = 8;
export const PASSWORD_LENGTH_MAX = 32;

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
        return [requiredField];
    }

    if (login.indexOf(' ') > -1) {
        return ["Логин не может содержать пробелы"];
    }
}

export function validatePassword(password: string): string[] {
    if (password == null || password.length === 0) {
        return [requiredField];
    }

    if (password.length < PASSWORD_LENGTH_MIN) {
        return [`Пароль должен быть длиннее ${PASSWORD_LENGTH_MIN} символов`];
    }

    if (password.length > PASSWORD_LENGTH_MAX) {
        return [`Пароль должен быть длиннее ${PASSWORD_LENGTH_MAX} символов`];
    }
}

export const requiredField = "Это поле обязательно для заполнения";

export function escapeXss(s: string): string {
    if (s == null) {
        return s;
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

export function validatePasswordConfirmation(password: string, passwordConfirmation: string): string[] {
    if (passwordConfirmation == null || passwordConfirmation.length === 0) {
        return [requiredField];
    }

    if (passwordConfirmation !== password) {
        return ["Пароли не совпадают"];
    }
}

export function isValidMail(email: string): boolean {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function validateMail(mail: string): string[] {
    if (mail == null || mail.length === 0) {
        return [requiredField];
    }

    if (!isValidMail(mail)) {
        return ["Некорректный email"];
    }
}
