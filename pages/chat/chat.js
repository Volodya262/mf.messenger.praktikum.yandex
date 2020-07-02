import {ChatApiStub} from "../../api/messages-api-stub.js";
import {chatListTemplate} from "./templates/chat-list.tmpl.js";
import {groupByAsArray, sortBy, splitByPredicate} from "../../utils/collections-utils.js";
import {messagesListTemplate} from "./templates/messages-list-tmpl.js";

document.addEventListener("DOMContentLoaded", function () {
    const api = new ChatApiStub();
    loadChats(api);
    loadMessages(api, 2);
});

export function loadChats(api) {
    const template = Handlebars.compile(chatListTemplate);
    api.getChats().then(
        chats => {
            if (chats.length > 0) {
                chats[1].isSelected = true;
            }

            const context = {chats: chats}
            document.getElementById('chat-list-container').innerHTML = template(context);
        }
    );
}

export function loadMessages(api, chatId) {
    api.getChatMessages(chatId).then(messages => {
        const convertedMessages = convertMessagesToViewModel(messages);
        const template = Handlebars.compile(messagesListTemplate);
        const context = {messageDayGroups: convertedMessages};
        document.getElementById('messages-list-container').innerHTML = template(context);
    })
}

function convertMessagesToViewModel(messages) {
    // в реакте эта стена кода смотрелась гораздо органичнее. Если мы засидимся на шаблонизаторах, то придется это переписать
    const groupedMessagesArray = groupByAsArray(messages || [], msg => dateFns.startOfDay(msg.date).getTime());
    const res = sortBy(groupedMessagesArray, group => group.key, (a, b) => a - b)
        .map(group => {
            const rawMessages = group.items;
            const splitPredicate = (currMsg, prevMsg) => currMsg.authorId !== prevMsg.authorId;
            const userGroupedMessagesArray = splitByPredicate(rawMessages, splitPredicate); // [[msg1, msg2, msg3],[msg4],[msg5]]
            const userMessageGroups = userGroupedMessagesArray.map(userMsgArray => (
                {
                    user: {
                        avatarUrl: userMsgArray[0].avatarUrl,
                        authorId: userMsgArray[0].authorId,
                        authorName: userMsgArray[0].authorName
                    },
                    messages: userMsgArray.map(msg => ({
                        message: msg.message,
                        date: msg.date
                    }))
                }
            ));
            return {date: new Date(group.key), messageUserGroups: userMessageGroups};
        });
    return res;
}