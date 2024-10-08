export class UserLoginException extends Error {
    public readonly code: UserLoginErrorCode;

    constructor(message: string, code: UserLoginErrorCode) {
        super(message);
        this.code = code;
        this.name = 'UserLoginException';
        Object.setPrototypeOf(this, UserLoginException.prototype);
    }
}

export enum UserLoginErrorCode {
    USERNAME_LENGTH_INVALID = 3001,
    USERNAME_CONTAINS_NUMBER,
    EMAIL_INVALID,
    USERNAME_NOT_STRING,
    PASSWORD_INCORRECT,
}
