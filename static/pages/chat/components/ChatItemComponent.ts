import {IChatPreview} from "../../../types/types.js";
import {VComponent} from "../../../core/v-react/v-component.js";
import {NoState} from "../../../core/v-react/types/no-state.js";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler.js";

export interface ChatItemComponentProps {
    chat: IChatPreview;
    onChatSelected: (id: number) => void;
    isSelected?: boolean
}

export class ChatItemComponent extends VComponent<ChatItemComponentProps, NoState> {
    render({chat, isSelected, onChatSelected}: Readonly<ChatItemComponentProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
        // language=Handlebars
        const template = `
            <div class="chat-item {{#if isSelected}}chat-item__selected {{/if}}">
                <img src={{chat.logoUrl}} class="chat-item__logo" alt="logo"/>
                <div class="chat-item__all-text-container">
                    <div class="chat-item__title-and-date-container">
                        <span class="chat-item__title">{{chat.title}}</span>
                        <span class="chat-item__date">{{dateFormat chat.date}}</span>
                    </div>
                    <div class="chat-item__author-and-message-container">
                        <span class="chat-item__author">{{chat.author}}: </span>
                        <span class="chat-item__message">{{chat.message}}</span>
                    </div>
                </div>
            </div>`;

        const context = {
            chat: chat,
            isSelected: isSelected
        }

        const eventListeners: ComponentEventHandler[] = [{
            querySelector: '.chat-item',
            event: 'click',
            func: () => onChatSelected(chat.id)
        }]

        return {context: context, template: template, eventListeners: eventListeners};
    }

}