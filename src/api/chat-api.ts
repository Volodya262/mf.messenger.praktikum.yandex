import {VFetch} from "../core/v-fetch/v-fetch";
import {VOptions} from "../core/v-fetch/types/v-options";
import {IChatCoreInfo, IUserInfo} from "../common/types/types";
import {IGetChatsResponse} from "./types/i-get-chats-response";
import {createIChatPreviewFromDto} from "./converters/chat-preview-converter";
import {IGetUserInfoResponse} from "./types/i-get-user-info-response";
import {createUserInfoFromDto} from "./converters/user-info-converter";
import {IAddChatRequestArg} from "./types/i-add-chat-arg";
import {ISignInRequestArgs} from "./types/i-sign-in-request-args";
import {IDefaultResponse} from "./types/i-default-response";
import {VResponse} from "../core/v-fetch/types/v-response";
import {ISignUpArg} from "./types/i-sign-up-arg";
import {NoArgs} from "./types/no-args";

const config = {
    baseUrl: 'https://ya-praktikum.tech/api/v2',
    headers: {
        'Content-Type': 'application/json',
    },
};

export class ChatApi {
    http = new VFetch(config);

    getChats(): Promise<IChatCoreInfo[]> {
        return new Promise<IChatCoreInfo[]>((resolve, reject) => {
            this.http.vGet<NoArgs, IGetChatsResponse[]>('/chats')
                .then(resp => resolve(createIChatPreviewFromDto(resp.data)))
                .catch(err => reject(err));
        })
    }

    getUserInfo(): Promise<IUserInfo> {
        return new Promise<IUserInfo>((resolve, reject) => {
            this.http.vGet<NoArgs, IGetUserInfoResponse>('/auth/user')
                .then(resp => resolve(createUserInfoFromDto(resp?.data)))
                .catch(err => reject(err));
        });
    }

    addChat(title: string): Promise<unknown> {
        const params: Partial<VOptions<IAddChatRequestArg>> = {
            data: {title: title}
        }

        return this.http.vPost('/chats', params);
    }

    signIn(login: string, password: string): Promise<VResponse<IDefaultResponse>> {
        const params: Partial<VOptions<ISignInRequestArgs>> = {
            data: {
                login: login,
                password: password
            }
        };

        return this.http.vPost<ISignInRequestArgs, IDefaultResponse>('/auth/signin', params);
    }

    logout(): Promise<VResponse<IDefaultResponse>> {
        return this.http.vPost<NoArgs, IDefaultResponse>('/auth/logout');
    }

    signUp(arg: ISignUpArg): Promise<VResponse<IDefaultResponse>> {
        const params = {
            data: {
                first_name: arg.name || 'vova',
                login: arg.login,
                second_name: arg.secondName || 'gorbatov',
                email: arg.mail,
                password: arg.password,
                phone: arg.phone || '12345678'
            },
        };

        return this.http.vPost('/auth/signup', params);
    }
}
