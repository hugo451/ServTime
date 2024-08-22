export class LoginException extends Error {
    code: number;

    constructor(message: string, code: LoginStatus) {
        super(message);
        this.code = code;
        this.name = 'LoginException';
    }
}

export enum LoginStatus {
    USER_NAME_LENGTH_INVALID = 1001,
    USER_NAME_HAS_NUMBER = 1002,
    USER_MAIL_INVALID = 1003,
    USER_NAME_NOT_STRING = 1004
}