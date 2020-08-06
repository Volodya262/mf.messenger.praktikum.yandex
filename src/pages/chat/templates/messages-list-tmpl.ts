import Handlebars from 'handlebars';

const handlebars = Handlebars
// language=Handlebars
const messageItemTemplate = `
    <div class="message-user-group__message-row">
        <div class="message-user-group__message-text">{{message}}</div>
        <div>{{timeFormat date}}</div>
    </div>`;

handlebars.registerPartial('messageItem', messageItemTemplate);

// language=Handlebars
const messagesUserGroupTemplate = `
    <div class="message-user-group">
        <img alt="user avatar" class="message-user-group__avatar" src={{user.avatarUrl}}>
        <div class="message-user-group__all-text-container">
            <div class="message-user-group__author-container">
                <span class="message-user-group__author">{{user.authorName}}</span>
            </div>
            <div class="message-user-group__messages-container">
                {{#each messages}}
                    {{> messageItem}}
                {{/each}}
            </div>
        </div>
    </div>`;

handlebars.registerPartial('messagesUserGroup', messagesUserGroupTemplate);

// language=Handlebars
const messagesDayGroupTemplate = `
    <div>
        <div class="date">{{dateFormat date}}</div>
        {{#each messageUserGroups}}
            {{> messagesUserGroup}}
        {{/each}}
    </div>`;

handlebars.registerPartial('messagesDayGroup', messagesDayGroupTemplate);

export const messagesListTemplate =
    `
    {{#each messageDayGroups}}
            {{> messagesDayGroup}}
        {{/each}}
    `