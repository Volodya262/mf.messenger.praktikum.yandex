import {inputErrorMessagesListTemplate} from "../common-templates/login-register-error.tmpl.js";

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
        element.classList.remove('auth-block__input__has-error');
    } else {
        element.classList.add('auth-block__input__has-error');
    }
}

export function showErrorsInContainer(containerId, errors) {
    if (errors?.length === 0) {
        return;
    }

    const template = Handlebars.compile(inputErrorMessagesListTemplate);
    const context = {errors: errors};

    document.getElementById(containerId).innerHTML = template(context);
}

export const requiredField = "Это поле обязательно для заполнения";