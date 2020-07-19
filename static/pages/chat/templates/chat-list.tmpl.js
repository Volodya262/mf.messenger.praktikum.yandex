// language=Handlebars
export const chatItemTemplate = `
    <div class="chat-item {{#if isSelected}}chat-item__selected {{/if}}">
        <img src={{logoUrl}} class="chat-item__logo" alt="logo"/>
        <div class="chat-item__all-text-container">
            <div class="chat-item__title-and-date-container">
                <span class="chat-item__title">{{title}}</span>
                <span class="chat-item__date">{{dateFormat date}}</span>
            </div>
            <div class="chat-item__author-and-message-container">
                <span class="chat-item__author">{{author}}: </span>
                <span class="chat-item__message">{{message}}</span>
            </div>
        </div>
    </div>`;

window.Handlebars.registerPartial('chatItem', chatItemTemplate);

export const chatListTemplate =
    `{{#each chats}}
        {{> chatItem}}
    {{/each}}
    `;