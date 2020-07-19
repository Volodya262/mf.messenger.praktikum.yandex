import {VComponent} from "../../../core/v-react/v-component.js";
import {NoProps} from "../../../core/v-react/types/no-props.js";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler.js";
import {LogoComponent} from "../../../common-components/LogoComponent.js";
import {escapeXss, hasErrors, hasNoErrors, validateLogin, validatePassword} from "../../validation-common.js";
import {InternalEventHandlersRegistrar} from "../../../core/v-react/types/internal-event-handlers-registrar.js";
import {
    ValidationErrorsComponent,
    ValidationErrorsComponentProps
} from "../../../common-components/ValidationErrorsComponent.js";

export interface LoginBlockComponentState {
    login?: string,
    loginHasErrors?: boolean,
    loginErrors?: string[]
    password?: string,
    passwordHasErrors?: boolean,
    passwordErrors?: string[]
}

export class LoginBlockComponent extends VComponent<NoProps, LoginBlockComponentState> {
    private logoComponent: LogoComponent;
    private validationErrorsComponent: ValidationErrorsComponent;

    constructor(props: NoProps,
                parentEventHandlerRegistrar: InternalEventHandlersRegistrar,
                notifyParentChildStateUpdated: () => void) {
        super(props, parentEventHandlerRegistrar, notifyParentChildStateUpdated);
        this.state = {
            loginHasErrors: false,
            passwordHasErrors: false
        }
    }

    componentDidMount(): void {
    }

    handleLoginBlur = (e: InputEvent) => {
        const value = (e.target as HTMLInputElement).value;
        const loginValidateRes = validateLogin(value);

        this.setState({
            login: value,
            loginHasErrors: hasErrors(loginValidateRes),
            loginErrors: loginValidateRes
        })
    }

    handlePasswordBlur = (e: InputEvent) => {
        const value = (e.target as HTMLInputElement).value;
        const passwordErrors = validatePassword(value);

        this.setState({
            password: value,
            passwordErrors: passwordErrors,
            passwordHasErrors: hasErrors(passwordErrors)
        })
    }

    handleFormSubmit = (e) => {
        const login = escapeXss(this.getState()?.login);
        const password = escapeXss(this.getState()?.password)
        const loginErrors = validateLogin(login);
        const passwordErrors = validatePassword(password);

        if (hasNoErrors(loginErrors) && hasNoErrors(passwordErrors)) {
            console.log({
                login: login,
                password: password,
            })
            alert(`Принято! login: ${login}, password: ${password}`)
        }

        e.preventDefault();
    }

    render(props: Readonly<NoProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
        if (this.logoComponent == null) {
            this.logoComponent = this.createChildComponent(LogoComponent, {});
        }

        if (this.validationErrorsComponent == null) {
            this.validationErrorsComponent = this.createChildComponent<ValidationErrorsComponent,
                ValidationErrorsComponentProps>(ValidationErrorsComponent, {});
        }

        // language=Handlebars
        const template = `
            <div class="auth-block">
                <div id="logo-root">
                    {{{renderComponentInstance logoComponent noProps}}}
                </div>
                <h1 class="auth-block__title">Вход</h1>
                <form class="auth-block__form" name="login">
                    <input class="auth-block__input login-block__login-input {{#if
                            loginInvalid}}input__has-error{{/if}}"
                           name="login" placeholder="Логин" type="text" value="{{login}}"/>
                    {{{renderComponentInstance validationErrorsComponent loginErrorsProps}}}
                    <input class="auth-block__input login-block__login-password {{#if
                            passwordInvalid}}input__has-error{{/if}}"
                           name="password" placeholder="Пароль"
                           type="password" value="{{password}}"/>
                    {{{renderComponentInstance validationErrorsComponent passwordErrorsProps}}}
                    <div class="login-block__buttons-container">
                        <button class="auth-block__button auth-block__primary-button" type="submit">Войти</button>
                        <button class="auth-block__button auth-block__secondary-button">Зарегистрироваться</button>
                    </div>
                </form>
            </div>
        `;

        const context = {
            logoComponent: this.logoComponent,
            noProps: {},
            login: this.getState()?.login,
            loginInvalid: this.getState()?.loginHasErrors,
            loginErrorsProps: {errors: this.getState()?.loginErrors},
            password: this.getState()?.password,
            passwordInvalid: this.getState()?.passwordHasErrors,
            passwordErrorsProps: {errors: this.getState()?.passwordErrors},
            validationErrorsComponent: this.validationErrorsComponent
        };

        const handlers: ComponentEventHandler[] = [
            {
                querySelector: '.login-block__login-input',
                event: 'blur',
                func: this.handleLoginBlur
            },
            {
                querySelector: '.login-block__login-password',
                event: 'blur',
                func: this.handlePasswordBlur
            },
            {
                querySelector: 'form',
                event: 'submit',
                func: this.handleFormSubmit
            }]

        return {context: context, template: template, eventListeners: handlers};
    }
}