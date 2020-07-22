import {VComponent} from "../../../core/v-react/v-component.js";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler.js";
import {IChatPreview} from "../../../types/types.js";
import {chatListTemplate} from "../templates/chat-list.tmpl.js";

export interface ChatListComponentProps {
    chats: IChatPreview[]
}

export class ChatListComponent extends VComponent<ChatListComponentProps, object> {
        render({chats}: Readonly<ChatListComponentProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
            const template = chatListTemplate;
            const context = {chats: chats}
            return {context: context, template: template};
        }
}