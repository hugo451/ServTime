export abstract class Exception<T> extends Error {
    public readonly code: T;
    
    constructor(name: string, message: string, code: T) {
        super(message);
        this.code = code;
        this.name = name;
        Object.setPrototypeOf(this, Exception.prototype); 
    }
}
