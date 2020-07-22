import {VComponent} from "../../../core/v-react/v-component.js";
import {ISingleMessage} from "../../../types/types.js";
import {NoState} from "../../../core/v-react/types/no-state.js";
import {ComponentEventHandler} from "../../../core/v-react/types/component-event-handler.js";
import {messagesListTemplate} from "../templates/messages-list-tmpl.js";
import {groupByAsArray, sortBy, splitByPredicate} from "../../../utils/collections-utils.js";

export interface MessageListComponentProps {
    messages: ISingleMessage[]
}

export class MessageListComponent extends VComponent<MessageListComponentProps, NoState> {
        render({messages}: Readonly<MessageListComponentProps>): { template: string; context: object; eventListeners?: ComponentEventHandler[] } {
            const convertedMessages = this.convertMessagesToViewModel(messages);
            const template = messagesListTemplate
            const context = {messageDayGroups: convertedMessages};
            return {context: context, template: template};
        }

    convertMessagesToViewModel(messages: ISingleMessage[]) {
        // в реакте эта стена кода смотрелась гораздо органичнее. Если мы засидимся на шаблонизаторах, то придется это переписать
        const groupedMessagesArray = groupByAsArray(messages || [], msg => window.dateFns.startOfDay(msg.date).getTime());
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

}