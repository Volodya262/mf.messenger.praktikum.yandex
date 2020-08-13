import {VComponent} from "./core/v-react/v-component";
import {ComponentEventHandler} from "./core/v-react/types/component-event-handler";
import {VRouter} from "./core/v-router/v-router";
import {ChatPageComponent} from "./pages/chat/components/ChatPageComponent";
import {ChatApiStub} from "./api/messages-api-stub";
import {NoProps} from "./core/v-react/types/no-props";
import {LoginPageComponent} from "./pages/login/components/LoginPageComponent";
import {registerAll} from "./common/utils/handlebars-custom-helpers";
import {RegisterPageComponent} from "./pages/register/components/RegisterPageComponent";
import {ChatApi} from "./api/chat-api";

interface MainPageState {
    userinfo: string;
    chatsInfo: string;
}

class MainPageComponent extends VComponent<NoProps, MainPageState> {
    readonly api = new ChatApi();
    getUserInfo = () => { // TODO убрать это непотребство
        this.api.getUserInfo().then(res => {
            console.log(res);
            this.setState({userinfo: JSON.stringify(res)})
        }).catch(err => {
            this.setState({userinfo: JSON.stringify(err)})
            console.log(err);
        });
    };

    logout = () => {
        this.api.logout()
            .then((res) => {
                alert(JSON.stringify(res));
            })
            .catch((err) => {
                alert(JSON.stringify(err))
            })
    }

    getChats = () => {
        this.api.getChats()
            .then((res) => {
                this.setState({
                    chatsInfo: JSON.stringify(res)
                })
            })
            .catch((err) => {
                this.setState({
                    chatsInfo: JSON.stringify(err)
                })
            })
    }

    addChat = () => {
        this.api.addChat('some new title')
            .then((res) => {
                alert(JSON.stringify(res));
            })
            .catch((err) => {
                alert(JSON.stringify(err))
            })
    }

    render(props: Readonly<NoProps>): { template: string; context: Record<string, unknown>; eventListeners?: ComponentEventHandler[] } {
        // language=Handlebars
        const template = `
            <div>
                <h1>Главная страница</h1>
                <p>

                </p>
                <div>
                    <button id="user-info-button">get user info</button>
                    <p>
                        {{userInfo}}
                    </p>
                </div>
                <div>
                    <button id="logout-button">logout</button>
                </div>
                <div>
                    <button id="get-chats">get chats</button>
                    <p>
                        {{chatsInfo}}
                    </p>
                </div>
                <button id="add-chat">add chats</button>
            </div>
        `;

        const handlers: ComponentEventHandler[] = [
            {
                querySelector: '#user-info-button',
                event: 'click',
                func: this.getUserInfo
            },
            {
                querySelector: '#logout-button',
                event: 'click',
                func: this.logout
            },
            {
                querySelector: '#get-chats',
                event: 'click',
                func: this.getChats
            },
            {
                querySelector: '#add-chat',
                event: 'click',
                func: this.addChat
            }
        ]

        const context = {
            userInfo: this.getState()?.userinfo,
            chatsInfo: this.getState()?.chatsInfo
        }

        return {context: context, template: template, eventListeners: handlers};
    }

}

document.addEventListener("DOMContentLoaded", function () {
    registerAll();

    const mainPageComponent = new MainPageComponent({});
    mainPageComponent.init()

    const chatComponent = new ChatPageComponent({}, new ChatApiStub());
    chatComponent.init();

    const loginPageComponent = new LoginPageComponent({});
    loginPageComponent.init();

    const registerPageComponent = new RegisterPageComponent({});
    registerPageComponent.init();

    const router = new VRouter(document.getElementById('root'));
    router.use('', mainPageComponent)
    router.use('chat', chatComponent)
    router.use('login', loginPageComponent)
    router.use('register', registerPageComponent)
    router.start();
});
