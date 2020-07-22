import { VComponent } from "./core/v-react/v-component.js";
import { VRouter } from "./core/v-router/v-router.js";
import { ChatPageComponent } from "./pages/chat/components/ChatPageComponent.js";
import { ChatApiStub } from "./api/messages-api-stub.js";
import { LoginPageComponent } from "./pages/login/components/LoginPageComponent.js";
class MainPageComponent extends VComponent {
    render(props) {
        const template = `
            <div>
                <h1>Главная страница</h1>
                <p>
                Отработал по замечаниям, добавил в чат возможность выбора чата. Всю эту неделю думал что эта работа у меня уже сдана)))
                </p>
            </div>
        `;
        return { context: {}, template: template };
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const mainPageComponent = new MainPageComponent({});
    mainPageComponent.init();
    const chatComponent = new ChatPageComponent({}, new ChatApiStub());
    chatComponent.init();
    const loginPageComponent = new LoginPageComponent({});
    loginPageComponent.init();
    const router = new VRouter(document.getElementById('root'));
    router.use('', mainPageComponent);
    router.use('chat', chatComponent);
    router.use('login', loginPageComponent);
    router.start();
});
//# sourceMappingURL=index.js.map