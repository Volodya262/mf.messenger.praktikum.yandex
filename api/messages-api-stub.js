import {maxBy} from "../utils/collections-utils.js";

export class ChatApiStub {
    chatNames = chatNames;
    chatsMessages = chatMessages;

    getChatMessages(chatId) {
        const res = this.chatsMessages.find(msgs => msgs.chatId === chatId);

        return new Promise(resolve => {
            setTimeout(() => resolve(res?.messages || []), 100);
        });
    }

    getChats() {
        const chats = this.makeChatPreviews(this.chatNames, this.chatsMessages)
        return new Promise(resolve => {
            setTimeout(() => resolve(chats), 100);
        })
    }

    sendMessage(chatId, messageText, userId, userName) {
        const newMsg = {
            date: new Date(),
            avatarUrl: imgUrl3,
            authorId: userId,
            authorName: userName,
            message: messageText
        }

        // const newChatsMessages = _.cloneDeep(this.chatsMessages);
        const newChatsMessages = this.chatsMessages;
        const chatMessagesIndex = newChatsMessages.findIndex(chatMsgs => chatMsgs.chatId === chatId);

        let chatMessages;
        if (chatMessagesIndex === -1) {
            chatMessages = {chatId: chatId, messages: []};
        } else {
            chatMessages = newChatsMessages[chatMessagesIndex];
            newChatsMessages.splice(chatMessagesIndex, 1);
        }
        chatMessages.messages.push(newMsg);
        newChatsMessages.push(chatMessages);

        this.chatsMessages = newChatsMessages;

        return new Promise(resolve => {
            setTimeout(() => resolve(), 500);
        })
    }

    makeChatPreviews(chatNames, allChatsMessages) {
        const previews = [];
        for (const chat of chatNames) {
            const chatMessages = allChatsMessages.find(msgs => msgs.chatId === chat.id)?.messages;
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
            } else {
                const lastMessage = maxBy(chatMessages, msgs => msgs.date, (a, b) => b.getTime() - a.getTime());
                const preview = {
                    id: chat.id,
                    title: chat.title,
                    logoUrl: lastMessage.avatarUrl,
                    message: lastMessage.message,
                    author: lastMessage.authorName,
                    date: lastMessage.date
                }
                previews.push(preview);
            }
        }
        return previews;
    }
}

const ipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';
const imgUrl1 = 'https://placekitten.com/200/200';
const imgUrl2 = 'https://placekitten.com/250/250';
const imgUrl3 = 'https://placekitten.com/300/300';

const chatNames = [
    {
        id: 1,
        title: 'чатик с Вовой'
    },
    {
        id: 2,
        title: 'чатик с Вовой'
    },
    {
        id: 3,
        title: 'чатик с Вовой'
    },
    {
        id: 4,
        title: 'Пустой чатик'
    },
]

const chatMessages = [
    {
        chatId: 1,
        messages: [
            {
                authorName: 'Вова',
                authorId: 1,
                date: new Date(2020, 0, 1),
                message: 'олды тут...',
                avatarUrl: imgUrl1
            }
        ]
    },
    {
        chatId: 2,
        messages: [
            {
                authorName: 'Вова',
                authorId: 1,
                date: new Date(2020, 0, 1, 12),
                message: 'Настал следующий день.' + ipsum + ipsum + ipsum + ipsum + ipsum + ipsum + ipsum + ipsum,
                avatarUrl: imgUrl1
            },
            {
                authorName: 'Валя',
                authorId: 2,
                date: new Date(2020, 0, 1, 13),
                message: 'Привет!!!!',
                avatarUrl: imgUrl2
            },
            {
                authorName: 'Валя',
                authorId: 2,
                date: new Date(2020, 0, 1, 14),
                message: 'Как дела?????' + ipsum + ipsum + ipsum + ipsum,
                avatarUrl: imgUrl2
            },
            {
                authorName: 'Валя',
                authorId: 2,
                date: new Date(2020, 0, 1, 16),
                message: 'ау??????',
                avatarUrl: imgUrl2
            },
            {
                authorName: 'Вова',
                authorId: 1,
                date: new Date(2020, 0, 1, 18),
                message: 'Это сообщение должно отображаться в отдельном блоке',
                avatarUrl: imgUrl1
            },
            {
                authorName: 'Вова',
                authorId: 1,
                date: new Date(2020, 0, 2, 12),
                message: 'Настал следующий день.' + ipsum + ipsum + ipsum + ipsum + ipsum + ipsum + ipsum + ipsum,
                avatarUrl: imgUrl1
            }
        ]
    },
    {
        chatId: 3,
        messages: [
            {
                authorName: 'Вова',
                authorId: 1,
                date: new Date(2020, 0, 1),
                message: 'раз',
                avatarUrl: imgUrl1
            },
            {
                authorName: 'Вова',
                authorId: 1,
                date: new Date(2020, 0, 3),
                message: 'три',
                avatarUrl: imgUrl1
            },
            {
                authorName: 'Вова',
                authorId: 1,
                date: new Date(2020, 0, 2),
                message: 'два',
                avatarUrl: imgUrl1
            }
        ]
    },
]