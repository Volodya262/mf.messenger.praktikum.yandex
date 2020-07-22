import {VComponent} from "../../../core/v-react/v-component.js";
import {IChatPreview, ISingleMessage} from "../../../types/types.js";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler.js";
import {ChatListComponent, ChatListComponentProps} from "./ChatListComponent.js";
import {MessageListComponent, MessageListComponentProps} from "./MessageListComponent.js";
import {IChatApi} from "../../../api/types/i-chat-api.js";
import {noop} from "../../../utils/common-utils.js";

export interface IChatProps {

}

export interface IChatState {
    chats: IChatPreview[],
    selectedChatId: number | null; // if null or undefined then no chat is selected
    selectedChatMessages: ISingleMessage[]; // if null or undefined then no chat is selected
    isLoading: boolean;
}

export class ChatPageComponent extends VComponent<IChatProps, IChatState> {
    private readonly chatApi;
    private chatListComponent: ChatListComponent;
    private messageListComponent: MessageListComponent;

    constructor(props: IChatProps, chatApi: IChatApi) {
        super(props);
        if (chatApi == null) {
            throw new TypeError(`Expected chatApi, but got ${chatApi}`);
        }
        this.chatApi = chatApi;

        this.componentDidMount.bind(this);
    }

    loadChats() {
        return this.chatApi.getChats();
    }

    loadChatMessages(id: number) {
        return this.chatApi.getChatMessages(id);
    }

    onChatSelected = (id: number) => {
        if (id === this.state.selectedChatId) {
            return;
        }

        this.setState({selectedChatId: id})
        this.loadChatMessages(id).then(msgs => this.setState({selectedChatMessages: msgs}))
    };

    componentDidMount() {
        this.loadChats().then(chats => {
            if (chats != null && chats.length > 0) {
                this.loadChatMessages(chats[0]).then(messages => {
                    this.setState({
                        chats: chats,
                        selectedChatId: chats[0],
                        selectedChatMessages: messages
                    })
                });
            } else {
                this.setState({
                    chats: chats
                })
            }
        });
    }

    render(props: Readonly<IChatProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
        if (this.chatListComponent == null) {
            this.chatListComponent = this.createChildComponent<ChatListComponent, ChatListComponentProps>(ChatListComponent,
                {chats: [], onChatSelected: noop});
        }

        if (this.messageListComponent == null) {
            this.messageListComponent = this.createChildComponent<MessageListComponent, MessageListComponentProps>(MessageListComponent,
                {messages: []})
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
                chats: this.getState()?.chats || [],
                onChatSelected: this.onChatSelected,
                selectedChatId: this.getState()?.selectedChatId
            },
            messageListComponent: this.messageListComponent,
            messageListComponentProps: {messages: this.getState()?.selectedChatMessages || []}
        }

        return {context: context, template: template};
    }

}