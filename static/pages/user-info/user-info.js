import {
    addValidationEventListener,
    escapeXss,
    hasNoErrors,
    requiredField,
    showValidateRes,
    validateLogin,
    validatePassword,
    validatePasswordConfirmation
} from "../validation-common.js";

let form;
let loginElement;
let nameElement;
let oldPasswordElement;
let passwordElement;
let passwordConfirmationElement;

document.addEventListener("DOMContentLoaded", function () {
    form = document.forms['user-info'];
    const elements = form.elements;

    loginElement = elements['login'];
    nameElement = elements['name'];
    oldPasswordElement = elements['old-password'];
    passwordElement = elements['password'];
    passwordConfirmationElement = elements['password-confirmation'];

    addValidationEventListener(loginElement, validateLogin, loginErrorsContainerId);
    addValidationEventListener(nameElement, validateName, nameErrorsContainerId);
    addValidationEventListener(oldPasswordElement, validatePassword, oldPasswordErrorsContainerId);
    addValidationEventListener(passwordElement, validatePassword, passwordErrorsContainerId);
    addValidationEventListener(passwordConfirmationElement,
        (passwordConfirmation) => validatePasswordConfirmation(escapeXss(passwordElement.value), passwordConfirmation),
        passwordConfirmationErrorsContainerId);

    form.addEventListener('submit', onSubmit)
})

function onSubmit(e) {
    const name = escapeXss(nameElement.value);
    const login = escapeXss(loginElement.value);
    const oldPassword = escapeXss(oldPasswordElement.value);
    const password = escapeXss(passwordElement.value);
    const passwordConfirmation = escapeXss(passwordConfirmationElement.value);

    const validateRes = validateAll(name, login, oldPassword, password, passwordConfirmation);
    showValidateResAll(validateRes);

    if (Object.values(validateRes).every(hasNoErrors)) {
        console.log({
            name: name,
            login: login,
            oldPassword: oldPassword,
            password: password,
            passwordConfirmation: passwordConfirmation
        })
    }
    e.preventDefault()
}

function validateAll(name, login, oldPassword, password, passwordConfirmation) {
    return ({
        name: validateName(name),
        login: validateLogin(login),
        oldPassword: validatePassword(oldPassword),
        password: validatePassword(password),
        passwordConfirmation: validatePasswordConfirmation(password, passwordConfirmation)
    })
}

function showValidateResAll(validateRes) {
    showValidateRes(validateRes.name, nameElement, nameErrorsContainerId);
    showValidateRes(validateRes.login, loginElement, loginErrorsContainerId);
    showValidateRes(validateRes.oldPassword, oldPasswordElement, oldPasswordErrorsContainerId);
    showValidateRes(validateRes.password, passwordElement, passwordErrorsContainerId);
    showValidateRes(validateRes.passwordConfirmation, passwordConfirmationElement, passwordConfirmationErrorsContainerId);
}

function validateName(login) {
    if (login == null || login.length === 0) {
        return [requiredField]
    }

    if (login.indexOf(' ') > -1) {
        return ["Логин не может содержать пробелы"]
    }
}

const mailErrorsContainerId = 'mail-errors-container';
const nameErrorsContainerId = 'name-errors-container';
const loginErrorsContainerId = 'login-errors-container';
const oldPasswordErrorsContainerId = 'old-password-errors-container';
const passwordErrorsContainerId = 'password-errors-container';
const passwordConfirmationErrorsContainerId = 'password-confirmation-errors-container';