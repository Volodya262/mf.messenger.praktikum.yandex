import {VComponent} from "../../../core/v-react/v-component";
import {IChatPreview, ISingleMessage} from "../../../common/types/types";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler";
import {ChatListComponent, ChatListComponentProps} from "./ChatListComponent";
import {MessageListComponent, MessageListComponentProps} from "./MessageListComponent";
import {IChatApi} from "../../../api/types/i-chat-api";
import {noop} from "../../../common/utils/common-utils";
import {NoProps} from "../../../core/v-react/types/no-props";

export interface IChatState {
    chats: IChatPreview[],
    selectedChatId: number | null; // if null or undefined then no chat is selected
    selectedChatMessages: ISingleMessage[]; // if null or undefined then no chat is selected
    isLoading: boolean;
}

export class ChatPageComponent extends VComponent<NoProps, IChatState> {
    private readonly chatApi;
    private chatListComponent: ChatListComponent;
    private messageListComponent: MessageListComponent;

    constructor(props: NoProps, chatApi: IChatApi) {
        super(props);
        if (chatApi == null) {
            throw new TypeError(`Expected chatApi, but got ${chatApi}`);
        }
        this.chatApi = chatApi;

        this.componentDidMount.bind(this);
    }

    loadChats(): Promise<IChatPreview[]> {
        return this.chatApi.getChats();
    }

    loadChatMessages(id: number): Promise<ISingleMessage[]> {
        return this.chatApi.getChatMessages(id);
    }

    onChatSelected: (id: number) => void = (id: number) => {
        if (id === this.state.selectedChatId) {
            return;
        }

        this.setState({selectedChatId: id})
        this.loadChatMessages(id).then(msgs => this.setState({selectedChatMessages: msgs}))
    };

    componentDidMount(): void {
        this.loadChats().then(chats => {
            if (chats != null && chats.length > 0) {
                this.loadChatMessages(chats[0].id).then(messages => {
                    this.setState({
                        chats: chats,
                        selectedChatId: chats[0].id,
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

    render(props: Readonly<NoProps>): { template: string; context: Record<string, unknown>; eventListeners?: ComponentEventHandler[] } {
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