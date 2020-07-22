import {VComponent} from "../../../core/v-react/v-component.js";
import {ChatItemComponent} from "./ChatItemComponent.js";

export class ChatListComponent extends VComponent {
    render({chats, selectedChatId, onChatSelected}) {
        // language=Handlebars
        const template = `{{#each chats}}
            {{{renderFunctionalComponent ../chatItemComponentClass this ../eventRegistrar}}}
        {{/each}}
    `;
        const sortedChatsWithSelectedInfo = chats
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map(chat => ({chat: chat, isSelected: chat.id === selectedChatId, onChatSelected: onChatSelected}));
        console.log(sortedChatsWithSelectedInfo);
        const context = {
            chats: sortedChatsWithSelectedInfo,
            chatItemComponentClass: ChatItemComponent,
            eventRegistrar: this.registerChildEventListeners
        };
        return {context: context, template: template};
    }
}
//# sourceMappingURL=ChatListComponent.js.map