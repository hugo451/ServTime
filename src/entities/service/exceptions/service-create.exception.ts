import { Exception } from "../../exceptions/exception";

export class ServiceCreateException extends Exception<ServiceCreateErrorCode> {
    public readonly code!: ServiceCreateErrorCode;
    
    constructor(message: string, code: ServiceCreateErrorCode) {
        super('ServiceCreateException', message, code);
        Object.setPrototypeOf(this, ServiceCreateException.prototype); 
    }
}

export enum ServiceCreateErrorCode {
    SERVICE_NAME_LENGTH_INVALID = 1001,
    SERVICE_NAME_HAS_NUMBER = 1002,
    SERVICE_TYPE_INVALID = 1003,
    SERVICE_NAME_NOT_STRING = 1004,
    FILE_READ_ERROR = 2001,
    FILE_WRITE_ERROR = 2002,
    SERVICE_CREATE_FAILED = 3001,
    SERVICE_DELETE_FAILED = 3002,
    SERVICE_FETCH_FAILED = 3003,
    SERVICE_UPDATE_FAILED = 3004,
    SERVICE_NOT_FOUND = 4001,
    VALIDATION_FAILED = 5001,
    INTERNAL_SERVER_ERROR,
}
