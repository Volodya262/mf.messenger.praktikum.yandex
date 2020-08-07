/* eslint-disable */
import {VFetch} from "../core/v-fetch/v-fetch";
import {VOptions} from "../core/v-fetch/types/v-options";

const config = {
    baseUrl: 'https://ya-praktikum.tech/api/v2',
    headers: {
        'Content-Type': 'application/json',
    },
};

export class ChatApi {
    http = new VFetch(config);

    getChats() {
        return this.http.vGet('/chats');
    }

    getUserInfo() {
        return this.http.vGet('/auth/user');
    }

    addChat(data: VOptions) {
        return this.http.vPost('/chats', data as VOptions);
    }

    signIn(data: unknown) {
        return this.http.vPost('/auth/signin', data as VOptions);
    }

    logout() {
        return this.http.vPost('/auth/logout');
    }

    signup(data: VOptions) {
        return this.http.vPost('/auth/signup', data as VOptions);
    }
}
