import {VComponent} from "../../../core/v-react/v-component.js";
import {ChatListComponent} from "./ChatListComponent.js";
import {MessageListComponent} from "./MessageListComponent.js";
import {noop} from "../../../utils/common-utils.js";

export class ChatPageComponent extends VComponent {
    constructor(props, chatApi) {
        super(props);
        this.onChatSelected = (id) => {
            if (id === this.state.selectedChatId) {
                return;
            }
            this.setState({selectedChatId: id});
            this.loadChatMessages(id).then(msgs => this.setState({selectedChatMessages: msgs}));
        };
        if (chatApi == null) {
            throw new TypeError(`Expected chatApi, but got ${chatApi}`);
        }
        this.chatApi = chatApi;
        this.componentDidMount.bind(this);
    }
    loadChats() {
        return this.chatApi.getChats();
    }
    loadChatMessages(id) {
        return this.chatApi.getChatMessages(id);
    }
    componentDidMount() {
        this.loadChats().then(chats => {
            if (chats != null && chats.length > 0) {
                this.loadChatMessages(chats[0]).then(messages => {
                    this.setState({
                        chats: chats,
                        selectedChatId: chats[0],
                        selectedChatMessages: messages
                    });
                });
            }
            else {
                this.setState({
                    chats: chats
                });
            }
        });
    }
    render(props) {
        var _a, _b, _c;
        if (this.chatListComponent == null) {
            this.chatListComponent = this.createChildComponent(ChatListComponent, {chats: [], onChatSelected: noop});
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
                        <input class="search-container__input" type="text" disabled/>
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
            chatListComponentProps: {
                chats: ((_a = this.getState()) === null || _a === void 0 ? void 0 : _a.chats) || [],
                onChatSelected: this.onChatSelected,
                selectedChatId: (_b = this.getState()) === null || _b === void 0 ? void 0 : _b.selectedChatId
            },
            messageListComponent: this.messageListComponent,
            messageListComponentProps: {messages: ((_c = this.getState()) === null || _c === void 0 ? void 0 : _c.selectedChatMessages) || []}
        };
        return { context: context, template: template };
    }
}
//# sourceMappingURL=ChatPageComponent.js.map