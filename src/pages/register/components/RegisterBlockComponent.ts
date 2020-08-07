import {VComponent} from "../../../core/v-react/v-component";
import {NoProps} from "../../../core/v-react/types/no-props";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler";
import {LogoComponent} from "../../common/components/LogoComponent";
import {InternalEventHandlersRegistrar} from "../../../core/v-react/types/internal-event-handlers-registrar";
import {ValidationErrorsComponent} from "../../common/components/ValidationErrorsComponent";
import {
    escapeXss,
    hasErrors, hasNoErrors,
    requiredField,
    validateLogin,
    validatePassword,
    validatePasswordConfirmation
} from "../../validation-common";
import {validateMail} from "../register";

export type fieldState = {
    value: string,
    hasErrors?: boolean,
    errors: string[]
};

export interface RegisterBlockState {
    mail: fieldState,
    login: fieldState,
    password: fieldState,
    passwordConfirmation: fieldState
}

type InputEventHandler = (e: InputEvent) => void;

export class RegisterBlockComponent extends VComponent<NoProps, RegisterBlockState> {
    constructor(props: NoProps,
                parentEventHandlerRegistrar: InternalEventHandlersRegistrar,
                notifyParentChildStateUpdated: () => void) {
        super(props, parentEventHandlerRegistrar, notifyParentChildStateUpdated);
        this.state = {
            mail: {errors: [], value: ''},
            login: {errors: [], value: ''},
            password: {errors: [], value: ''},
            passwordConfirmation: {errors: [], value: ''},
        }
    }

    private logoComponent: LogoComponent;
    private validationErrorsComponent: ValidationErrorsComponent;

    handleMailBlur: InputEventHandler = (e) => {
        const value = escapeXss((e.target as HTMLInputElement).value);
        this.validateMailAndUpdateState(value);
    }

    validateMailAndUpdateState(mail: string): void {
        const validateRes = validateMail(mail);
        this.setState({
            mail: {
                value: mail,
                hasErrors: hasErrors(validateRes),
                errors: validateRes
            }
        })
    }

    handleLoginBlur: InputEventHandler = (e: InputEvent) => {
        const value = escapeXss((e.target as HTMLInputElement).value);
        this.validateLoginAndUpdateState(value);
    }

    validateLoginAndUpdateState(login: string): void {
        const loginValidateRes = validateLogin(login);

        this.setState({
            login: {
                value: login,
                hasErrors: hasErrors(loginValidateRes),
                errors: loginValidateRes
            }
        })
    }

    handlePasswordBlur: InputEventHandler = (e: InputEvent) => {
        const value = escapeXss((e.target as HTMLInputElement).value);
        this.validatePasswordAndUpdateState(value);
    }

    validatePasswordAndUpdateState(password: string): void {
        const passwordErrors = validatePassword(password);

        this.setState({
            password: {
                value: password,
                errors: passwordErrors,
                hasErrors: hasErrors(passwordErrors)
            }
        })
    }

    handlePasswordConfirmationBlur: InputEventHandler = (e: InputEvent) => {
        const value = escapeXss((e.target as HTMLInputElement).value);
        this.validatePasswordConfirmationAndUpdateState(this.getState()?.password.value, value);
    }

    validatePasswordConfirmationAndUpdateState(password: string, passwordConfirmation: string): void {
        const passwordConfirmationErrors = validatePasswordConfirmation(password, passwordConfirmation);

        this.setState({
            passwordConfirmation: {
                value: passwordConfirmation,
                hasErrors: hasErrors(passwordConfirmationErrors),
                errors: passwordConfirmationErrors
            }
        })
    }

    handleFormSubmit: InputEventHandler = (e: InputEvent) => {
        const mail = escapeXss(this.getState()?.mail?.value || '');
        const login = escapeXss(this.getState()?.login?.value || '');
        const password = escapeXss(this.getState()?.password?.value || '')
        const passwordConfirmation = escapeXss(this.getState()?.passwordConfirmation?.value || '')
        const loginErrors = validateLogin(login);
        const passwordErrors = validatePassword(password);
        const mailErrors = validatePassword(mail);
        const passwordConfirmationErrors = validatePassword(passwordConfirmation);
        this.validateLoginAndUpdateState(login); // TODO validate вызывается дважды
        this.validatePasswordAndUpdateState(password);
        this.validateMailAndUpdateState(mail);
        this.validatePasswordConfirmationAndUpdateState(password, passwordConfirmation);

        if (hasNoErrors(loginErrors) && hasNoErrors(passwordErrors) && hasNoErrors(mailErrors) && hasNoErrors(passwordConfirmationErrors)) {
            console.log({
                login: login,
                password: password,
                mail: mail,
                passwordConfirmation: passwordConfirmation
            })
            alert(`Принято! login: ${login}, password: ${password}`)
        }

        e.preventDefault();
    }

    render(props: Readonly<NoProps>): { template: string; context: Record<string, unknown>; eventListeners?: ComponentEventHandler[] } {
        if (this.logoComponent == null) {
            this.logoComponent = this.createChildComponent(LogoComponent, {});
        }
        if (this.validationErrorsComponent == null) {
            this.validationErrorsComponent = this.createChildComponent(ValidationErrorsComponent, {});
        }

        // language=Handlebars
        const template = `
        <div class="auth-block">
        {{{renderComponentInstance logoComponent noProps}}}
        <h1 class="auth-block__title">Регистрация</h1>
        <form name="register">
            <div class="auth-block__inputs-container">
                <div class="auth-block__input-with-errors-container">
                    <input class="auth-block__input register-block__mail-input {{#if
                            mailInvalid}}input__has-error{{/if}}"
                           name="mail" placeholder="Почта" type="text" value="{{mail}}"/>
                    {{{renderComponentInstance validationErrorsComponent mailErrorsProps}}}
                </div>
                <div class="auth-block__input-with-errors-container">
                    <input class="auth-block__input register-block__login-input {{#if
                            loginInvalid}}input__has-error{{/if}}"
                           name="login" placeholder="Логин" type="text" value="{{login}}"/>
                    {{{renderComponentInstance validationErrorsComponent loginErrorsProps}}}
                </div>
                <div class="auth-block__input-with-errors-container">
                    <input class="auth-block__input register-block__password-input {{#if
                            passwordInvalid}}input__has-error{{/if}}"
                           name="password" placeholder="Пароль" type="password" value="{{password}}"/>
                    {{{renderComponentInstance validationErrorsComponent passwordErrorsProps}}}
                </div>
                <div class="auth-block__input-with-errors-container">
                    <input class="auth-block__input register-block__password-confirmation-input {{#if
                            passwordConfirmationInvalid}}input__has-error{{/if}}"
                           name="password-confirmation" placeholder="Пароль еще раз" type="password" value="{{passwordConfirmation}}"/>

                    {{{renderComponentInstance validationErrorsComponent passwordConfirmationErrorsProps}}}
                </div>
            </div>
            <div class="login-block__buttons-container">
                <button class="auth-block__button auth-block__primary-button" type="submit">Зарегистрироваться</button>
                <button class="auth-block__button auth-block__secondary-button">Войти</button>
            </div>
        </form>
    </div>
        `;

        const context = {
            logoComponent: this.logoComponent,
            validationErrorsComponent: this.validationErrorsComponent,
            noProps: {},
            mail: this.getState()?.mail?.value,
            mailInvalid: this.getState()?.mail?.hasErrors,
            mailErrorsProps: {errors: this.getState()?.mail?.errors},
            login: this.getState()?.login?.value,
            loginInvalid: this.getState()?.login?.hasErrors,
            loginErrorsProps: {errors: this.getState()?.login?.errors},
            password: this.getState()?.password?.value,
            passwordInvalid: this.getState()?.password?.hasErrors,
            passwordErrorsProps: {errors: this.getState()?.password?.errors},
            passwordConfirmation: this.getState()?.passwordConfirmation?.value,
            passwordConfirmationInvalid: this.getState()?.passwordConfirmation?.hasErrors,
            passwordConfirmationErrorsProps: {errors: this.getState()?.passwordConfirmation?.errors},
        };

        const handlers: ComponentEventHandler[] = [
            {
                querySelector: '.register-block__mail-input',
                event: 'blur',
                func: this.handleMailBlur
            },
            {
                querySelector: '.register-block__login-input',
                event: 'blur',
                func: this.handleLoginBlur
            },
            {
                querySelector: '.register-block__password-input',
                event: 'blur',
                func: this.handlePasswordBlur
            },
            {
                querySelector: '.register-block__password-confirmation-input',
                event: 'blur',
                func: this.handlePasswordConfirmationBlur
            },
            {
                querySelector: 'form',
                event: 'submit',
                func: this.handleFormSubmit
            }
        ]

        return {context: context, template: template, eventListeners: handlers};
    }

}
