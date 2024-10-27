import { makeAutoObservable } from "mobx";

export class MementoStore<T> {
    private history: T[] = [];
    private currentIndex = -1;

    constructor() {
        makeAutoObservable(this);
    }

    saveState(state: T): void {
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        this.history.push(state);
        this.currentIndex = this.history.length - 1;
    }

    undo(): T | null {
        if (this.canUndo()) {
            this.currentIndex--;
            return this.history[this.currentIndex];
        }
        return null;
    }

    redo(): T | null {
        if (this.canRedo()) {
            this.currentIndex++;
            return this.history[this.currentIndex];
        }
        return null;
    }

    canUndo(): boolean {
        return this.currentIndex > 0;
    }

    canRedo(): boolean {
        return this.currentIndex < this.history.length - 1;
    }
}
