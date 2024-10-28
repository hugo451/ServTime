import { Exception } from '../../exceptions/exception';

export class ServiceCreateException extends Exception<ServiceCreateErrorCode> {
    public readonly code!: ServiceCreateErrorCode;

    constructor(message: string, code: ServiceCreateErrorCode) {
        super('ServiceCreateException', message, code);
        Object.setPrototypeOf(this, ServiceCreateException.prototype);
    }
}

export enum ServiceCreateErrorCode {
    NAME_LENGTH_INVALID = 1001,
    NAME_HAS_NUMBER = 1002,
    TYPE_INVALID = 1003,
    NAME_NOT_STRING = 1004,
    FILE_READ_ERROR = 2001,
    FILE_WRITE_ERROR = 2002,
    CREATE_FAILED = 3001,
    DELETE_FAILED = 3002,
    FETCH_FAILED = 3003,
    UPDATE_FAILED = 3004,
    NOT_FOUND = 4001,
    VALIDATION_FAILED = 5001,
    INTERNAL_SERVER_ERROR,
}
