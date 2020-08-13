import {VComponent} from "../../../core/v-react/v-component";
import {ISingleMessage, IUserMessagesGroup} from "../../../common/types/types";
import {NoState} from "../../../core/v-react/types/no-state";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler";
import {messagesListTemplate} from "../templates/messages-list-tmpl";
import {groupByAsArray, sortBy, splitByPredicate} from "../../../common/utils/collections-utils";
import {startOfDay} from "date-fns";

export interface MessageListComponentProps {
    messages: ISingleMessage[]
}

type MessageListComponentViewModel = {
    date: Date;
    messageUserGroups: {
        messages: { date: Date; message: string }[];
        user: { avatarUrl: string; authorName: string; authorId: number }
    }[]
}[]

export class MessageListComponent extends VComponent<MessageListComponentProps, NoState> {
    render({messages}: Readonly<MessageListComponentProps>): { template: string; context: Record<string, unknown>; eventListeners?: ComponentEventHandler[] } {
        const convertedMessages = this.convertMessagesToViewModel(messages);
        const template = messagesListTemplate;
        const context = {messageDayGroups: convertedMessages};
        return {context, template};
    }

    convertMessagesToViewModel(messages: ISingleMessage[]): MessageListComponentViewModel {
        const groupedMessagesArray = groupByAsArray(messages || [], msg => startOfDay(msg.date).getTime());
        return sortBy(groupedMessagesArray, group => group.key, (a, b) => a - b)
            .map(group => {
                const rawMessages = group.items;
                const splitPredicate = (currMsg, prevMsg) => currMsg.authorId !== prevMsg.authorId;
                const userGroupedMessagesArray = splitByPredicate(rawMessages, splitPredicate); // [[msg1, msg2, msg3],[msg4],[msg5]]
                const userMessageGroups: IUserMessagesGroup[] = userGroupedMessagesArray.map(userMsgArray => (
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
    }

}
