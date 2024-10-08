export class CRUDException extends Error {
    public readonly code: CRUDErrorCode;

    constructor(message: string, code: CRUDErrorCode) {
        super(message);
        this.code = code;
        this.name = 'CRUDException';
        Object.setPrototypeOf(this, CRUDException.prototype);
    }
}

export enum CRUDErrorCode {
    FILE_READ_ERROR = 1001,
    FILE_WRITE_ERROR = 1002,
    CREATE_FAILED = 2001,
    DELETE_FAILED = 2002,
    FETCH_FAILED = 2003,
    UPDATE_FAILED = 2004,
    VALIDATION_FAILED = 2005,
    NOT_FOUND = 4001,
}
