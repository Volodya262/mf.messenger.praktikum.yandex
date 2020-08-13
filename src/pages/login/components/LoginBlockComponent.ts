import {VComponent} from "../../../core/v-react/v-component";
import {NoProps} from "../../../core/v-react/types/no-props";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler";
import {LogoComponent} from "../../common/components/LogoComponent";
import {escapeXss, hasErrors, hasNoErrors, validateLogin, validatePassword} from "../../validation-common";
import {InternalEventHandlersRegistrar} from "../../../core/v-react/types/internal-event-handlers-registrar";
import {
    ValidationErrorsComponent,
    ValidationErrorsComponentProps
} from "../../common/components/ValidationErrorsComponent";
import {ChatApi} from "../../../api/chat-api";
import {VResponse} from "../../../core/v-fetch/types/v-response";
import {IDefaultResponse} from "../../../api/types/i-default-response";

export interface LoginBlockComponentState {
    login?: string,
    loginHasErrors?: boolean,
    loginErrors?: string[]
    password?: string,
    passwordHasErrors?: boolean,
    passwordErrors?: string[]
}

type InputEventHandler = (e: InputEvent) => void;

export class LoginBlockComponent extends VComponent<NoProps, LoginBlockComponentState> {
    private logoComponent: LogoComponent;
    private validationErrorsComponent: ValidationErrorsComponent;
    private readonly api = new ChatApi();

    constructor(props: NoProps,
                parentEventHandlerRegistrar: InternalEventHandlersRegistrar,
                notifyParentChildStateUpdated: () => void) {
        super(props, parentEventHandlerRegistrar, notifyParentChildStateUpdated);
        this.state = {
            loginHasErrors: false,
            passwordHasErrors: false
        }
    }

    handleLoginBlur: InputEventHandler = (e: InputEvent) => {
        const value = escapeXss((e.target as HTMLInputElement).value);
        this.validateLoginAndUpdateState(value);
    }

    validateLoginAndUpdateState(login: string): void {
        const loginValidateRes = validateLogin(login);

        this.setState({
            login: login,
            loginHasErrors: hasErrors(loginValidateRes),
            loginErrors: loginValidateRes
        })
    }

    validatePasswordAndUpdateState(password: string): void {
        const passwordErrors = validatePassword(password);

        this.setState({
            password: password,
            passwordErrors: passwordErrors,
            passwordHasErrors: hasErrors(passwordErrors)
        })
    }

    handlePasswordBlur: InputEventHandler = (e: InputEvent) => {
        const value = escapeXss((e.target as HTMLInputElement).value);
        this.validatePasswordAndUpdateState(value);
    }

    handleFormSubmit: InputEventHandler = (e: InputEvent) => {
        const login = escapeXss(this.getState()?.login);
        const password = escapeXss(this.getState()?.password)
        const loginErrors = validateLogin(login);
        const passwordErrors = validatePassword(password);
        this.validateLoginAndUpdateState(login);
        this.validatePasswordAndUpdateState(password);

        if (hasNoErrors(loginErrors) && hasNoErrors(passwordErrors)) {
            this.sendLoginReq(login, password);
        }

        e.preventDefault();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    sendLoginReq(login: string, password: string): void {
        this.api.signIn(login, password)
            .then((res: VResponse<IDefaultResponse>) => {
                if (res.status === 200) {
                    alert('success!')
                } else {
                    alert("failed:" + JSON.stringify(res)); // todo обработка ошибки
                }
            })
            .catch((err: unknown) => {
                alert("error:" + JSON.stringify(err)); // todo обработка ошибки
            });
    }

    render(props: Readonly<NoProps>): { template: string; context: Record<string, unknown>; eventListeners?: ComponentEventHandler[] } {
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
