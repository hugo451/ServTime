import { Repository } from '../../repository';
import { Log } from '../log';

export class LogList extends Repository<Log> {
    private static _instance: LogList;
    private list: Log[];

    private constructor(list?: Log[]) {
        super();
        this.list = list || [];
    }

    public static get instance(): LogList {
        if (!LogList._instance) {
            LogList._instance = new LogList();
        }
        return LogList._instance;
    }

    init(list: Log[]): Log[] {
        if (this.list.length === 0) {
            this.list = list;
        }
        return Array.from(this.list) as Log[];
    }

    create(body: Log): Log {
        this.list.push(body);
        return body;
    }

    delete(id: string): Log {
        const log = this.find(id);
        if (!log) {
            throw new Error('Log not found.');
        }
        const index = this.list.findIndex((log) => log.id === id);
        this.list.splice(index, 1);
        return log;
    }

    findAll(): Log[] {
        return Array.from(this.list) as Log[];
    }

    find(id: string): Log | undefined {
        return this.list.find((log) => log.id === id);
    }

    update(id: string, body: Log): Log {
        const index = this.list.findIndex((log) => log.id === id);
        if (index === -1) {
            throw new Error('Log not found.');
        }
        this.list[index] = body;
        return body;
    }
}
