import * as path from 'path';
import * as fs from 'fs';
import { Log } from '../log';
import { Repository } from '../../repository';
import {
    LogCreateErrorCode,
    LogCreateException,
} from '../exceptions/log-create.exception';

export class FileLogRepository extends Repository<Log> {
    private static _path = path.join(__dirname, '../../../files/logs.json');
    private static _instance: FileLogRepository;

    private constructor() {
        super();
    }

    public static get instance(): FileLogRepository {
        if (!FileLogRepository._instance) {
            FileLogRepository._instance = new FileLogRepository();
        }
        return FileLogRepository._instance;
    }

    private static _readFile(): Log[] {
        try {
            if (!fs.existsSync(FileLogRepository._path)) {
                return [];
            }
            const data = fs.readFileSync(FileLogRepository._path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new LogCreateException(
                'Failed to read file.',
                LogCreateErrorCode.FILE_READ_ERROR,
            );
        }
    }

    private static _writeFile(logs: Log[]): void {
        try {
            fs.writeFileSync(
                FileLogRepository._path,
                JSON.stringify(logs, null, 2),
            );
        } catch (error) {
            throw new LogCreateException(
                'Failed to write file.',
                LogCreateErrorCode.FILE_WRITE_ERROR,
            );
        }
    }

    init(data: Log[]): Log[] {
        if (this.findAll().length === 0) {
            FileLogRepository._writeFile(data);
        }
        return data;
    }

    create(body: Log): Log {
        try {
            const logs = FileLogRepository._readFile();
            logs.push(body);
            FileLogRepository._writeFile(logs);
            return body;
        } catch (error) {
            throw new LogCreateException(
                'Failed to create log.',
                LogCreateErrorCode.CREATE_FAILED,
            );
        }
    }

    delete(id: string): Log {
        try {
            const logs = FileLogRepository._readFile();
            const index = logs.findIndex((log) => log.id === id);
            if (index === -1) {
                throw new LogCreateException(
                    'Log not found.',
                    LogCreateErrorCode.NOT_FOUND,
                );
            }
            const [deletedLog] = logs.splice(index, 1);
            FileLogRepository._writeFile(logs);
            return deletedLog;
        } catch (error) {
            throw new LogCreateException(
                'Failed to delete log.',
                LogCreateErrorCode.DELETE_FAILED,
            );
        }
    }

    findAll(): Log[] {
        try {
            return FileLogRepository._readFile();
        } catch (error) {
            throw new LogCreateException(
                'Failed to find logs.',
                LogCreateErrorCode.FETCH_FAILED,
            );
        }
    }

    update(id: string, body: Log): Log {
        try {
            const logs = FileLogRepository._readFile();
            const index = logs.findIndex((log) => log.id === id);
            if (index === -1) {
                throw new LogCreateException(
                    'Log not found.',
                    LogCreateErrorCode.NOT_FOUND,
                );
            }
            logs[index] = { ...logs[index], ...body };
            FileLogRepository._writeFile(logs);
            return logs[index];
        } catch (error) {
            throw new LogCreateException(
                'Failed to update log.',
                LogCreateErrorCode.UPDATE_FAILED,
            );
        }
    }
}
