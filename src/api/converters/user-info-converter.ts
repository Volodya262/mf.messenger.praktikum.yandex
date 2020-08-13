import {IGetUserInfoResponse} from "../types/i-get-user-info-response";
import {IUserInfo} from "../../common/types/types";

export function createUserInfoFromDto(resp: IGetUserInfoResponse): IUserInfo {
    if (resp == null) {
        return null;
    }

    return {
        login: resp.login,
        displayName: resp.display_name,
        email: resp.email,
        firstName: resp.first_name,
        secondName: resp.second_name
    };
}
