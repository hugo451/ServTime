export interface Command<T, U> {
    execute(params: T): Promise<U>;
}
