import {
    clearNode,
    PASSWORD_LENGTH_MAX,
    PASSWORD_LENGTH_MIN,
    requiredField,
    showErrorsInContainer,
    toggleInputValid,
    validateEmail
} from "../login-register-common.js";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.forms.register;
    form.addEventListener('submit', e => {
        e.preventDefault()
        onSubmit();
    });

    const mailElement = form.elements.mail;
    mailElement.addEventListener('blur', () => {
        const mail = mailElement.value;
        const res = validateMail(mail);
        showValidateRes(res, mailElement, mailErrorsContainerId)
    });

    const loginElement = form.elements.login;
    loginElement.addEventListener('blur', () => {
        const value = loginElement.value;
        const res = validateLogin(value);
        showValidateRes(res, loginElement, loginErrorsContainerId)
    });

    const passwordElement = form.elements.password;
    passwordElement.addEventListener('blur', () => {
        const value = passwordElement.value;
        const res = validatePassword(value);
        showValidateRes(res, passwordElement, passwordErrorsContainerId)
    });

    const passwordConfirmationElement = form.elements['password-confirmation'];
    passwordConfirmationElement.addEventListener('blur', () => {
        const value = passwordConfirmationElement.value;
        const res = validatePasswordConfirmation(passwordElement.value, value);
        showValidateRes(res, passwordConfirmationElement, passwordConfirmationErrorsContainerId)
    });

})

function onSubmit() {
    clearErrors();
    const form = document.forms.register;

    const mailElement = form.elements.mail;
    const mail = mailElement.value;

    const loginElement = form.elements.login;
    const login = loginElement.value;

    const passwordElement = form.elements.password;
    const password = passwordElement.value;

    const passwordConfirmationElement = form.elements['password-confirmation'];
    const passwordConfirmation = passwordConfirmationElement.value;

    const validateRes = validate(mail, login, password, passwordConfirmation);
    showValidateResAll(validateRes, mailElement, loginElement, passwordElement, passwordConfirmationElement);

    if (hasNoErrors(validateRes.mail) && hasNoErrors(validateRes.login) && hasNoErrors(validateRes.password) && hasNoErrors(validateRes.passwordConfirmation)) {
        console.log({
            mail: mail,
            login: login,
            password: password,
            passwordConfirmation: passwordConfirmation
        })
    }
}

function hasNoErrors(arr) {
    return arr == null || arr.length === 0;
}

function showValidateResAll(validateRes, mailElement, loginElement, passwordElement, passwordConfirmationElement) {
    showValidateRes(validateRes.mail, mailElement, mailErrorsContainerId)
    showValidateRes(validateRes.login, loginElement, loginErrorsContainerId)
    showValidateRes(validateRes.password, passwordElement, passwordErrorsContainerId)
    showValidateRes(validateRes.passwordConfirmation, passwordConfirmationElement, passwordConfirmationErrorsContainerId)
}

function showValidateRes(errors, inputElement, errorsContainerId) {
    showErrorsInContainer(errorsContainerId, errors);
    toggleInputValid(inputElement, errors);
}

function validate(mail, login, password, passwordConfirmation) {
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

function validateLogin(login) {
    if (login == null || login.length === 0) {
        return [requiredField]
    }
}

function validatePassword(password) {
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

function validatePasswordConfirmation(password, passwordConfirmation) {
    if (passwordConfirmation == null || passwordConfirmation.length === 0) {
        return [requiredField]
    }

    if (passwordConfirmation !== password) {
        return ["Пароли не совпадают"];
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