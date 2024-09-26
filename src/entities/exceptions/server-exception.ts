export class ServerException extends Error {
    public readonly code: ServerErrorCode;
    
    constructor(message: string, code: ServerErrorCode) {
        super(message);
        this.code = code;
        this.name = 'ServerException';
        Object.setPrototypeOf(this, ServerException.prototype); 
    }
}

export enum ServerErrorCode {
    VALIDATION_FAILED = 1001,
    INTERNAL_SERVER_ERROR,
}