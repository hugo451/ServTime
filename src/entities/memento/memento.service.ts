export class MementoService <T> {
    public currentState: T | null;
    constructor(currentState: T | null = null) {
        this.currentState = currentState;
    }

    public undo(): T | null {
        console.log(this.currentState);
        if(this.currentState){
            const state = this.currentState;
            this.currentState = null;
            return state;
        }
        return null;
    }

    public updateState(state: T): T {
        this.currentState = state;
        console.log(this.currentState);
        return this.currentState;
    }
}