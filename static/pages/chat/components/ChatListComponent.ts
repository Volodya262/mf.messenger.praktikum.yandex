import {VComponent} from "../../../core/v-react/v-component.js";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler.js";
import {IChatPreview} from "../../../types/types.js";
import {ChatItemComponent, ChatItemComponentProps} from "./ChatItemComponent.js";

export interface ChatListComponentProps {
    chats: IChatPreview[],
    selectedChatId?: number | null
    onChatSelected: (number) => void;
}

export class ChatListComponent extends VComponent<ChatListComponentProps, object> {
    render({chats, selectedChatId, onChatSelected}: Readonly<ChatListComponentProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
        // language=Handlebars
        const template =
                `{{#each chats}}
            {{{renderFunctionalComponent ../chatItemComponentClass this ../eventRegistrar}}}
        {{/each}}
    `;

        const sortedChatsWithSelectedInfo: ChatItemComponentProps[] = chats
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map(chat => ({chat: chat, isSelected: chat.id === selectedChatId, onChatSelected: onChatSelected}));

        const context = {
            chats: sortedChatsWithSelectedInfo,
            chatItemComponentClass: ChatItemComponent,
            eventRegistrar: this.registerChildEventListeners
        }
        return {context: context, template: template};
    }
}