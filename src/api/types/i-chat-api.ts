import {IChatPreview, ISingleMessage} from "../../common/types/types";

export interface IChatApi {
    /**
     * Получить список чатов
     */
    getChats(): Promise<IChatPreview[]>;

    /**
     * Получить сообщения чата
     * @param chatId id чата
     */
    getChatMessages(chatId: number): Promise<ISingleMessage[]>;

    /**
     * Отправить сообщение
     * @param chatId id чата
     * @param messageText текст сообщения
     * @param userId id юзера
     * @param userName имя юзера
     */
    // В реальном приложении userId и, тем более, user name брались бы из какого-нибудь userContext, который брался бы из куков
    sendMessage(chatId: number, messageText: string, userId: number, userName: string): Promise<void>;
}