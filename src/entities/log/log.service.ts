import { LogCreateErrorCode, LogCreateException } from "./exceptions/log-create.exception";
import { Log } from "./log";
import { FileLogRepository } from "./repositories/file-log.repository";
import { LogList } from "./repositories/in-memory-log.repository";

export abstract class LogService {
    private logFileList: FileLogRepository;
    private logList: LogList;

    protected constructor() {
        this.logFileList = FileLogRepository.instance;
        this.logList = LogList.instance;
        const list = this.logFileList.findAll();
        this.logList.init(list);
    }

    async log(log: Log): Promise<Log> {
        try {
            this.logFileList.create(log);
            return this.logList.create(log);
        } catch (error) {
            if (error instanceof LogCreateException) {
                throw error;
            }
            throw new LogCreateException('Failed to create log.', LogCreateErrorCode.CREATE_FAILED);
        }
    }

    async generateRelatory(entity: string): Promise<unknown> {
        try {
            const logs = this.logList.findAll().filter(log => log.entity === entity);
            const result = this.handleGenerateRelatory(logs);
            return result;
        } catch (error) {
            if (error instanceof LogCreateException) {
                throw error;
            }
            throw new LogCreateException('Failed to create log.', LogCreateErrorCode.CREATE_FAILED);
        }
    }

    protected abstract handleGenerateRelatory(logs: Log[]): Promise<unknown>;
}   