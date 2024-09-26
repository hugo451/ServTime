import { Exception } from "../../exceptions/exception";

export class CategoryCreateException extends Exception<CategoryCreateErrorCode> {
    public readonly code!: CategoryCreateErrorCode;
    
    constructor(message: string, code: CategoryCreateErrorCode) {
        super('CategoryCreateException', message, code);
        Object.setPrototypeOf(this, CategoryCreateException.prototype); 
    }
}


export enum CategoryCreateErrorCode {
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