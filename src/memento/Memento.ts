// memento.ts
import { makeAutoObservable } from 'mobx';

export class Memento<T> {
    constructor(public state: T) {}
}

export class UndoableStore<T> {
    private mementos: Memento<T>[] = [];
    private currentState: T;

    constructor(initialState: T) {
        this.currentState = initialState;
        makeAutoObservable(this);
    }

    save() {
        this.mementos.push(new Memento(this.currentState));
    }

    undo(): T | null {
        if (this.mementos.length === 0) {
            return null; // No state to undo
        }
        const memento = this.mementos.pop();
        if (memento) {
            this.currentState = memento.state;
        }
        return this.currentState;
    }

    setCurrentState(newState: T) {
        this.currentState = newState;
    }

    getCurrentState() {
        return this.currentState;
    }
}