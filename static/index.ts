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
                Отработал по замечаниям, добавил в чат возможность выбора чата. Всю эту неделю думал что эта работа у меня уже сдана)))
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
