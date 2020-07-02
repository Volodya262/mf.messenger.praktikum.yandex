import {
    addValidationEventListener,
    clearNode,
    escapeXss,
    hasNoErrors,
    requiredField,
    showValidateRes,
    validateEmail,
    validateLogin,
    validatePassword,
    validatePasswordConfirmation
} from "../validation-common.js";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.forms.register;
    form.addEventListener('submit', e => {
        e.preventDefault()
        onSubmit();
    });

    const mailElement = form.elements.mail;
    addValidationEventListener(mailElement, validateMail, mailErrorsContainerId);

    const loginElement = form.elements.login;
    addValidationEventListener(loginElement, validateLogin, loginErrorsContainerId);

    const passwordElement = form.elements.password;
    addValidationEventListener(passwordElement, validatePassword, passwordErrorsContainerId);

    const passwordConfirmationElement = form.elements['password-confirmation'];
    addValidationEventListener(passwordConfirmationElement,
        (passwordConfirmation) => validatePasswordConfirmation(escape(passwordElement.value), passwordConfirmation),
        passwordConfirmationErrorsContainerId);
})

function onSubmit() {
    clearErrors();
    const form = document.forms.register; // todo вынести в переменные файла по аналогии с user-info.js

    const mailElement = form.elements.mail;
    const mail = escapeXss(mailElement.value);

    const loginElement = form.elements.login;
    const login = escapeXss(loginElement.value);

    const passwordElement = form.elements.password;
    const password = escapeXss(passwordElement.value);

    const passwordConfirmationElement = form.elements['password-confirmation'];
    const passwordConfirmation = escapeXss(passwordConfirmationElement.value);

    const validateRes = validateAll(mail, login, password, passwordConfirmation);
    showValidateResAll(validateRes, mailElement, loginElement, passwordElement, passwordConfirmationElement);

    if (Object.values(validateRes).every(hasNoErrors)) {
        console.log({
            mail: mail,
            login: login,
            password: password,
            passwordConfirmation: passwordConfirmation
        })
    }
}

function showValidateResAll(validateRes, mailElement, loginElement, passwordElement, passwordConfirmationElement) {
    showValidateRes(validateRes.mail, mailElement, mailErrorsContainerId)
    showValidateRes(validateRes.login, loginElement, loginErrorsContainerId)
    showValidateRes(validateRes.password, passwordElement, passwordErrorsContainerId)
    showValidateRes(validateRes.passwordConfirmation, passwordConfirmationElement, passwordConfirmationErrorsContainerId)
}

function validateAll(mail, login, password, passwordConfirmation) {
    return ({
        mail: validateMail(mail),
        login: validateLogin(login),
        password: validatePassword(password),
        passwordConfirmation: validatePasswordConfirmation(password, passwordConfirmation)
    })
}

function validateMail(mail) {
    if (mail == null || mail.length === 0) {
        return [requiredField]
    }

    if (!validateEmail(mail)) {
        return ["Некорректный email"]
    }
}

function clearErrors() {
    clearNode(mailErrorsContainerId);
    clearNode(loginErrorsContainerId);
    clearNode(passwordErrorsContainerId);
    clearNode(passwordConfirmationErrorsContainerId);
}

const mailErrorsContainerId = 'mail-errors-container';
const loginErrorsContainerId = 'login-errors-container';
const passwordErrorsContainerId = 'password-errors-container';
const passwordConfirmationErrorsContainerId = 'password-confirmation-errors-container';