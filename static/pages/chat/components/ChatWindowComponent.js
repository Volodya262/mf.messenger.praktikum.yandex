import { VComponent } from "../../../core/v-react/v-component.js";
import { ChatListComponent } from "./ChatListComponent.js";
import { MessageListComponent } from "./MessageListComponent.js";
export class ChatWindowComponent extends VComponent {
    constructor(props, chatApi) {
        super(props);
        if (chatApi == null) {
            throw new TypeError(`Expected chatApi, but got ${chatApi}`);
        }
        this.chatApi = chatApi;
        this.componentDidMount.bind(this);
        this.loadChats.bind(this); // почему-то если loadChats - стрелочная функция, то componentDidMount её не видит
        this.loadChatMessages.bind(this);
    }
    loadChats() {
        return this.chatApi.getChats().then(chats => {
            if (chats.length > 0) {
                chats[1].isSelected = true;
            }
            return chats;
        });
    }
    loadChatMessages(id) {
        return this.chatApi.getChatMessages(id);
    }
    componentDidMount() {
        const selectedChatId = 2;
        this.loadChats().then(chats => {
            if (chats != null && chats.length > 0) {
                this.loadChatMessages(selectedChatId).then(messages => {
                    this.setState({
                        chats: chats,
                        selectedChatId: chats[0],
                        selectedChatMessages: messages
                    });
                });
            }
            else {
                this.setState({
                    chats: chats,
                    selectedChatId: chats[0]
                });
            }
        });
    }
    render(props) {
        var _a, _b;
        if (this.chatListComponent == null) {
            this.chatListComponent = this.createChildComponent(ChatListComponent, { chats: [] });
        }
        if (this.messageListComponent == null) {
            this.messageListComponent = this.createChildComponent(MessageListComponent, { messages: [] });
        }
        // TODO разбить на компоненты как в старом проекте на реакте: chat, chat-list, input-main, message-list, ...
        // language=Handlebars
        const template = `
            <div class="chat-window">
                <div class="chat-list-and-search-input-container">
                    <div class="search-container">
                        <input class="search-container__input" type="text"/>
                        <div class="search-container__send-button-container">
                            <button class="search__send-button">
                                <i class="fas fa-search fa-2x"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chat-list-container-wrapper">
                        <div id="chat-list-container">
                            {{{renderComponentInstance chatListComponent chatListComponentProps}}}
                        </div>
                    </div>
                </div>
                <div class="messages-list-and-input-container">
                    <div class="messages-list-container-wrapper">
                        <div class="messages-list-container" id="messages-list-container">
                            {{{renderComponentInstance messageListComponent messageListComponentProps}}}
                        </div>
                    </div>
                    <div class="input-main-container">
                        <textarea class="input-main__input"></textarea>
                        <div class="input-main__send-button-container">
                            <button class="input__send-button">
                                <i class="fas fa-paper-plane fa-3x"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const context = {
            chatListComponent: this.chatListComponent,
            chatListComponentProps: { chats: ((_a = this.getState()) === null || _a === void 0 ? void 0 : _a.chats) || [] },
            messageListComponent: this.messageListComponent,
            messageListComponentProps: { messages: ((_b = this.getState()) === null || _b === void 0 ? void 0 : _b.selectedChatMessages) || [] }
        };
        return { context: context, template: template };
    }
}
//# sourceMappingURL=ChatWindowComponent.js.map