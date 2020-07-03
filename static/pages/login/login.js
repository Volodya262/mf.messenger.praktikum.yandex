// form.elements;

import {
    addValidationEventListener,
    escapeXss,
    hasNoErrors,
    showValidateRes,
    validateLogin,
    validatePassword
} from "../validation-common.js";

const loginErrorsContainerId = 'login-errors-container';
const passwordErrorsContainerId = 'password-errors-container';

// переменные объявлены на уровне модуля потому что используются в 2-х функциях:
// document.addEventListener("DOMContentLoaded", ...) и onSubmit
let loginElement;
let passwordElement;

document.addEventListener("DOMContentLoaded", function () {
    const form = document.forms.login;
    const elements = form.elements;
    loginElement = elements['login'];
    passwordElement = elements['password'];

    addValidationEventListener(loginElement, validateLogin, loginErrorsContainerId)
    addValidationEventListener(passwordElement, validatePassword, passwordErrorsContainerId)

    form.addEventListener('submit', function (e) {
        onSubmit(e);
    })
})

function onSubmit(e) {
    e.preventDefault();
    const login = escapeXss(loginElement.value);
    const password = escapeXss(passwordElement.value);
    const validateRes = validateAll(login, password);
    showValidateResAll(validateRes);

    if (Object.values(validateRes).every(hasNoErrors)) {
        console.log({
            login: login,
            password: password,
        })
    }
}

function validateAll(login, password) {
    return ({
        login: validateLogin(login),
        password: validatePassword(password),
    })
}

function showValidateResAll(validateRes) {
    showValidateRes(validateRes.login, loginElement, loginErrorsContainerId)
    showValidateRes(validateRes.password, passwordElement, passwordErrorsContainerId)
}