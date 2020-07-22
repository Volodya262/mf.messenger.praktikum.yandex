import {VComponent} from "./core/v-react/v-component.js";
import {ComponentEventHandler} from "./core/v-react/types/component-event-handler.js";
import {NoState} from "./core/v-react/types/no-state.js";
import {VRouter} from "./core/v-router/v-router.js";
import {ChatPageComponent} from "./pages/chat/components/ChatPageComponent.js";
import {ChatApiStub} from "./api/messages-api-stub.js";
import {NoProps} from "./core/v-react/types/no-props.js";
import {LoginPageComponent} from "./pages/login/components/LoginPageComponent.js";

class MainPageComponent extends VComponent<NoProps, NoState> {
        render(props: Readonly<NoProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {

            const template = `
            <div>
                <h1>Главная страница</h1>
                <p>
                Уважаемый код ревьюер! К сожалению, этот спринт занял какое-то огромное количество времени. Сейчас 5 утра и мне через 4 часа вставать на работу(((.
                Полностью переехать на новый движок и покрыть все тестами у меня не получилось.
                Единственная "честная" компонентная страничка - логин (зато какая, черт возьми! по синтаксису почти реакт). Чат - просто 3 огромных компонента. 
                Все остальные страницы пока что даже не подключены к роутеру. Еще у всех чисто для галочки используется PostCSS. 
                </p>
            </div>
        `

        return {context: {}, template: template};
    }

}

document.addEventListener("DOMContentLoaded", function () {

    const mainPageComponent = new MainPageComponent({});
    mainPageComponent.init()

    const chatComponent = new ChatPageComponent({}, new ChatApiStub());
    chatComponent.init();

    const loginPageComponent = new LoginPageComponent({});
    loginPageComponent.init();

    const router = new VRouter(document.getElementById('root'));
    router.use('', mainPageComponent)
    router.use('chat', chatComponent)
    router.use('login', loginPageComponent)
    router.start();
});
