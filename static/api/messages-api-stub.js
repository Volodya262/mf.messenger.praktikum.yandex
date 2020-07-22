import { maxBy } from "../utils/collections-utils.js";
import { chatMessages, chatNames, imgUrl3 } from "./chat-stub-data.js";
export class ChatApiStub {
    constructor() {
        this.chatNames = chatNames;
        this.chatsMessages = chatMessages;
    }
    getChatMessages(chatId) {
        const res = this.chatsMessages.find(msgs => msgs.chatId === chatId);
        return new Promise(resolve => {
            setTimeout(() => resolve((res === null || res === void 0 ? void 0 : res.messages) || []), 100);
        });
    }
    getChats() {
        const chats = this.makeChatPreviews(this.chatNames, this.chatsMessages);
        return new Promise(resolve => {
            setTimeout(() => resolve(chats), 100);
        });
    }
    sendMessage(chatId, messageText, userId, userName) {
        const newMsg = {
            date: new Date(),
            avatarUrl: imgUrl3,
            authorId: userId,
            authorName: userName,
            message: messageText
        };
        // const newChatsMessages = _.cloneDeep(this.chatsMessages); // TODO добавить клонирование
        const newChatsMessages = this.chatsMessages;
        const chatMessagesIndex = newChatsMessages.findIndex(chatMsgs => chatMsgs.chatId === chatId);
        let chatMessages;
        if (chatMessagesIndex === -1) {
            chatMessages = { chatId: chatId, messages: [] };
        }
        else {
            chatMessages = newChatsMessages[chatMessagesIndex];
            newChatsMessages.splice(chatMessagesIndex, 1);
        }
        chatMessages.messages.push(newMsg);
        newChatsMessages.push(chatMessages);
        this.chatsMessages = newChatsMessages;
        return new Promise(resolve => {
            setTimeout(() => resolve(), 500);
        });
    }
    makeChatPreviews(chatNames, allChatsMessages) {
        var _a;
        const previews = [];
        for (const chat of chatNames) {
            const chatMessages = (_a = allChatsMessages.find(msgs => msgs.chatId === chat.id)) === null || _a === void 0 ? void 0 : _a.messages;
            if (chatMessages == null || chatMessages.length === 0) {
                const preview = {
                    id: chat.id,
                    title: chat.title,
                    date: new Date(),
                    author: 'none',
                    message: 'No messages for this chat found',
                    logoUrl: imgUrl3
                };
                previews.push(preview);
            }
            else {
                const lastMessage = maxBy(chatMessages, msgs => msgs.date, (a, b) => b.getTime() - a.getTime());
                const preview = {
                    id: chat.id,
                    title: chat.title,
                    logoUrl: lastMessage.avatarUrl,
                    message: lastMessage.message,
                    author: lastMessage.authorName,
                    date: lastMessage.date
                };
                previews.push(preview);
            }
        }
        return previews;
    }
}
//# sourceMappingURL=messages-api-stub.js.map