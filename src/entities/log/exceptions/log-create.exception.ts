import { Exception } from "../../exceptions/exception";

export class LogCreateException extends Exception<LogCreateErrorCode> {
    public readonly code!: LogCreateErrorCode;
    
    constructor(message: string, code: LogCreateErrorCode) {
        super('LogCreateException', message, code);
        Object.setPrototypeOf(this, LogCreateException.prototype); 
    }
}


export enum LogCreateErrorCode {
    FILE_READ_ERROR = 1001,
    FILE_WRITE_ERROR,
    CREATE_FAILED = 2001,
    DELETE_FAILED,
    FETCH_FAILED,
    UPDATE_FAILED,
    VALIDATION_FAILED,
    NOT_FOUND,
    USER_NAME_LENGTH_INVALID = 5001,
    USER_NAME_HAS_NUMBER,
    USER_MAIL_INVALID,
    USER_NAME_NOT_STRING,
}