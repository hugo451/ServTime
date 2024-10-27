import { stringCapitalize } from "../utils/string-capitalize";

export function createExceptionTemplate(entity: string): string {
    return (
    `
    import { Exception } from '../../exceptions/exception';

    export class ${stringCapitalize(entity)}CreateException extends Exception<${stringCapitalize(entity)}CreateErrorCode> {
        public readonly code!: ${stringCapitalize(entity)}CreateErrorCode;

        constructor(message: string, code: ${stringCapitalize(entity)}CreateErrorCode) {
            super('${stringCapitalize(entity)}CreateException', message, code);
            Object.setPrototypeOf(this, ${stringCapitalize(entity)}CreateException.prototype);
        }
    }

    export enum ${stringCapitalize(entity)}CreateErrorCode {
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

    `
    );
}