import {IChatPreview} from "../../common/types/types";
import {IGetChatsResponse} from "../types/i-get-chats-response";

export function createIChatPreviewFromDto(resp: IGetChatsResponse[]): IChatPreview[] {
    if (resp == null) {
        return []
    }

    return resp.map(item => ({
        id: item.id,
        title: item.title,
        logoUrl: item.avatar,
        author: 'unknown',
        date: new Date(),
        message: 'unknown'
    }));
}
