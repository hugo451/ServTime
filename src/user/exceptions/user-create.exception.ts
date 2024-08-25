export class UserCreateException extends Error {
    public readonly code: UserCreateErrorCode;
    
    constructor(message: string, code: UserCreateErrorCode) {
        super(message);
        this.code = code;
        this.name = 'UserCreateException';
        Object.setPrototypeOf(this, UserCreateException.prototype); 
    }
}

export enum UserCreateErrorCode {
    USER_NAME_LENGTH_INVALID = 1001,
    USER_NAME_HAS_NUMBER = 1002,
    USER_MAIL_INVALID = 1003,
    USER_NAME_NOT_STRING = 1004,
    FILE_READ_ERROR = 2001,
    FILE_WRITE_ERROR = 2002,
    USER_CREATE_FAILED = 3001,
    USER_DELETE_FAILED = 3002,
    USER_FETCH_FAILED = 3003,
    USER_UPDATE_FAILED = 3004,
    USER_NOT_FOUND = 4001,
    VALIDATION_FAILED = 5001,
    INTERNAL_SERVER_ERROR,
}
