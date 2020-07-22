import {VComponent} from "../../../core/v-react/v-component.js";
import {chatListTemplate} from "../templates/chat-list.tmpl.js";

export class ChatListComponent extends VComponent {
    render({chats}) {
        const template = chatListTemplate;
        const context = {chats: chats};
        return {context: context, template: template};
    }
}

//# sourceMappingURL=ChatListComponent.js.map