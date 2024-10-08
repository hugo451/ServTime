import { Repository } from "../../repository";
import { Log } from "../log";

export class LogList extends Repository<Log> {
    private static _instance: LogList;
    private list: Log[];
    
    private constructor(list?: Log[]) {
        super();
        this.list = list || [];
    }
    
    public static get instance(): LogList{
        if(!LogList._instance){
            LogList._instance = new LogList();
        }
        return LogList._instance;
    }

    public setList(list: Log[]): void{
        if(this.list.length === 0){
            this.list = list;
        }
    }
    
    create(body: Log): Log {
        this.list.push(body);
        return body;
    }

    delete(id: string): Log {
        throw new Error("Method not implemented.");
    }

    findAll(): Log[] {
        return Array.from(this.list) as Log[];
    }

    find(id: string): Log | undefined {
        return this.list.find(log => log.id === id);
    }

    update(id: string, body: Log): Log {
        throw new Error("Method not implemented.");
    }
}