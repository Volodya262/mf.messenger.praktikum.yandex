// TODO раскидать эти типы по папочкам и разным файлам когда будет webpack

/**
 * Информация о чате, как она бы хранилась в БД
 */
export interface IChatCoreInfo {
    id: number,
    title: string
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
 * Превьюха чата в окне выбора чатов
 */
export interface IChatPreview {
    id: number;
    logoUrl: string;
    title: string;
    author: string;
    message: string;
    date: Date;
    // isSelected?: boolean;
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
