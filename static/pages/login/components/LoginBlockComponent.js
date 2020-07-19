import { VComponent } from "../../../core/v-react/v-component.js";
import { LogoComponent } from "../../../common-components/LogoComponent.js";
import { escapeXss, hasErrors, hasNoErrors, validateLogin, validatePassword } from "../../validation-common.js";
import { ValidationErrorsComponent } from "../../../common-components/ValidationErrorsComponent.js";
export class LoginBlockComponent extends VComponent {
    constructor(props, parentEventHandlerRegistrar, notifyParentChildStateUpdated) {
        super(props, parentEventHandlerRegistrar, notifyParentChildStateUpdated);
        this.handleLoginBlur = (e) => {
            const value = e.target.value;
            const loginValidateRes = validateLogin(value);
            this.setState({
                login: value,
                loginHasErrors: hasErrors(loginValidateRes),
                loginErrors: loginValidateRes
            });
        };
        this.handlePasswordBlur = (e) => {
            const value = e.target.value;
            const passwordErrors = validatePassword(value);
            this.setState({
                password: value,
                passwordErrors: passwordErrors,
                passwordHasErrors: hasErrors(passwordErrors)
            });
        };
        this.handleFormSubmit = (e) => {
            var _a, _b;
            const login = escapeXss((_a = this.getState()) === null || _a === void 0 ? void 0 : _a.login);
            const password = escapeXss((_b = this.getState()) === null || _b === void 0 ? void 0 : _b.password);
            const loginErrors = validateLogin(login);
            const passwordErrors = validatePassword(password);
            if (hasNoErrors(loginErrors) && hasNoErrors(passwordErrors)) {
                console.log({
                    login: login,
                    password: password,
                });
                alert(`login: ${login}, password: ${password}`);
            }
            e.preventDefault();
        };
        this.state = {
            loginHasErrors: false,
            passwordHasErrors: false
        };
    }
    componentDidMount() {
    }
    render(props) {
        var _a, _b, _c, _d, _e, _f;
        if (this.logoComponent == null) {
            this.logoComponent = this.createChildComponent(LogoComponent, {});
        }
        if (this.validationErrorsComponent == null) {
            this.validationErrorsComponent = this.createChildComponent(ValidationErrorsComponent, {});
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
            login: (_a = this.getState()) === null || _a === void 0 ? void 0 : _a.login,
            loginInvalid: (_b = this.getState()) === null || _b === void 0 ? void 0 : _b.loginHasErrors,
            loginErrorsProps: { errors: (_c = this.getState()) === null || _c === void 0 ? void 0 : _c.loginErrors },
            password: (_d = this.getState()) === null || _d === void 0 ? void 0 : _d.password,
            passwordInvalid: (_e = this.getState()) === null || _e === void 0 ? void 0 : _e.passwordHasErrors,
            passwordErrorsProps: { errors: (_f = this.getState()) === null || _f === void 0 ? void 0 : _f.passwordErrors },
            validationErrorsComponent: this.validationErrorsComponent
        };
        const handlers = [
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
            }
        ];
        return { context: context, template: template, eventListeners: handlers };
    }
}
//# sourceMappingURL=LoginBlockComponent.js.map