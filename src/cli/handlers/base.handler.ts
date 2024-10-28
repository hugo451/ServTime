export abstract class BaseHandler {
    protected nextHandler?: BaseHandler;

    setNext(handler: BaseHandler): BaseHandler {
        this.nextHandler = handler;
        return handler;
    }

    async handle(command: string, entityName: string): Promise<void> {
        if (this.shouldHandle(command)) {
            entityName = entityName.toLowerCase();
            await this.execute(entityName);
        }
        if (this.nextHandler) {
            await this.nextHandler.handle(command, entityName);
        }
    }

    protected abstract shouldHandle(command: string): boolean;
    protected abstract execute(entityName: string): Promise<void>;
}
