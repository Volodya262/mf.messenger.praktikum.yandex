import {inputErrorMessagesListTemplate} from "../common-templates/input-error-message.js";

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const PASSWORD_LENGTH_MIN = 8;
export const PASSWORD_LENGTH_MAX = 32;

export function clearNode(id) {
    const node = document.getElementById(id);
    if (node != null) {
        node.innerHTML = "";
    }
}

export function toggleInputValid(element, errors) {
    if (element == null) {
        return;
    }

    if (errors == null || errors.length === 0) {
        element.classList.remove('input__has-error');
    } else {
        element.classList.add('input__has-error');
    }
}

export function showErrorsInContainer(containerId, errors) {
    if (errors?.length === 0) {
        return;
    }

    const template = window.Handlebars.compile(inputErrorMessagesListTemplate);
    const context = {errors: errors};

    document.getElementById(containerId).innerHTML = template(context);
}

export function hasNoErrors(arr) {
    return arr == null || arr.length === 0;
}

export function validateLogin(login) {
    if (login == null || login.length === 0) {
        return [requiredField]
    }

    if (login.indexOf(' ') > -1) {
        return ["Логин не может содержать пробелы"]
    }
}

export function validatePassword(password) {
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

export function validatePasswordConfirmation(password, passwordConfirmation) {
    if (passwordConfirmation == null || passwordConfirmation.length === 0) {
        return [requiredField]
    }

    if (passwordConfirmation !== password) {
        return ["Пароли не совпадают"];
    }
}

export function showValidateRes(errors, inputElement, errorsContainerId) {
    showErrorsInContainer(errorsContainerId, errors);
    toggleInputValid(inputElement, errors);
}

export function addValidationEventListener(target, validateFn, errorsContainerId) {
    target.addEventListener('blur', () => {
        const value = escapeXss(target.value);
        const res = validateFn(value);
        showValidateRes(res, target, errorsContainerId)
    });
}

export const requiredField = "Это поле обязательно для заполнения";

export function escapeXss(s) {
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