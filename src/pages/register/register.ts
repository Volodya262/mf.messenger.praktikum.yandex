import {
    escapeXss,
    hasNoErrors,
    requiredField,
    validateEmail,
    validateLogin,
    validatePassword,
    validatePasswordConfirmation
} from "../validation-common";

const mailErrorsContainerId = 'mail-errors-container';
const loginErrorsContainerId = 'login-errors-container';
const passwordErrorsContainerId = 'password-errors-container';
const passwordConfirmationErrorsContainerId = 'password-confirmation-errors-container';

let mailElement;
let loginElement;
let passwordElement;
let passwordConfirmationElement;

// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.forms.register;
//     form.addEventListener('submit', e => {
//         e.preventDefault()
//         onSubmit();
//     });
//
//     mailElement = form.elements.mail;
//     addValidationEventListener(mailElement, validateMail, mailErrorsContainerId);
//
//     loginElement = form.elements.login;
//     addValidationEventListener(loginElement, validateLogin, loginErrorsContainerId);
//
//     passwordElement = form.elements.password;
//     addValidationEventListener(passwordElement, validatePassword, passwordErrorsContainerId);
//
//     passwordConfirmationElement = form.elements['password-confirmation'];
//     addValidationEventListener(passwordConfirmationElement,
//         (passwordConfirmation) => validatePasswordConfirmation(escape(passwordElement.value), passwordConfirmation),
//         passwordConfirmationErrorsContainerId);
// })

function onSubmit() {
    // clearErrors();
    const mail = escapeXss(mailElement.value);
    const login = escapeXss(loginElement.value);
    const password = escapeXss(passwordElement.value);
    const passwordConfirmation = escapeXss(passwordConfirmationElement.value);

    const validateRes = validateAll(mail, login, password, passwordConfirmation);
    // showValidateResAll(validateRes, mailElement, loginElement, passwordElement, passwordConfirmationElement);

    if (Object.values(validateRes).every(hasNoErrors)) {
        console.log({
            mail: mail,
            login: login,
            password: password,
            passwordConfirmation: passwordConfirmation
        })
    }
}

function validateAll(mail, login, password, passwordConfirmation) {
    return ({
        mail: validateMail(mail),
        login: validateLogin(login),
        password: validatePassword(password),
        passwordConfirmation: validatePasswordConfirmation(password, passwordConfirmation)
    })
}

export function validateMail(mail: string): string[] {
    if (mail == null || mail.length === 0) {
        return [requiredField]
    }

    if (!validateEmail(mail)) {
        return ["Некорректный email"]
    }
}

// function clearErrors() {
//     clearNode(mailErrorsContainerId);
//     clearNode(loginErrorsContainerId);
//     clearNode(passwordErrorsContainerId);
//     clearNode(passwordConfirmationErrorsContainerId);
// }
