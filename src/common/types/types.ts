// TODO раскидать эти типы по папочкам и разным файлам когда будет webpack

/**
 * Информация о чате без доп. информации
 */
export interface IChatCoreInfo {
    id: number,
    title: string
    logoUrl?: string;
}

/**
 * Расширенная информация о чате
 */
export interface IChatPreview extends IChatCoreInfo {
    author: string;
    message: string;
    date: Date;
}

export interface IUserInfo {
    login: string;
    email: string;
    firstName: string;
    secondName: string;
    displayName: string;
}

export interface IChatMessages {
    /**
     * id чата, которому принадлежат сообщения
     */
    chatId: number;

    /**
     * Сообщения этого чата
     */
    messages: ISingleMessage[];
}

/**
 * Сообщение в чате
 */
export interface ISingleMessage {
    message: string;
    authorName: string;
    authorId: number;
    avatarUrl: string;
    date: Date;
}

/**
 * Список сообщений, отправленных пользователем подряд
 */

export interface IUserMessagesGroup {
    /**
     * Информация о пользователе (имя, аватарка, id)
     */
    user: IUserMessagesGroupUser,
    /**
     * Список сообщений
     */
    messages: IUserMessagesGroupMessage[]
}

export interface IUserMessagesGroupMessage {
    message: string,
    date: Date
}

export interface IUserMessagesGroupUser {
    avatarUrl: string,
    authorId: number,
    authorName: string,
}
