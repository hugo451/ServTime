import { stringCapitalize } from '../../utils/string-capitalize';

export function fileRepositoryTemplate(entity: string): string {
    return `
    import * as path from 'path';
    import * as fs from 'fs';
    import {
        ${stringCapitalize(entity)}CreateException,
        ${stringCapitalize(entity)}CreateErrorCode,
    } from '../exceptions/${entity}-create.exception';
    import { ${stringCapitalize(entity)} } from '../${entity}';
    import { Repository } from '../../repository';

    export class File${stringCapitalize(entity)}Repository extends Repository<${stringCapitalize(entity)}> {
        private static _path = path.join(__dirname, '../../../files/${entity}s.json');
        private static _instance: File${stringCapitalize(entity)}Repository;

        private constructor() {
            super();
        }

        public static get instance(): File${stringCapitalize(entity)}Repository {
            if (!File${stringCapitalize(entity)}Repository._instance) {
                File${stringCapitalize(entity)}Repository._instance = new File${stringCapitalize(entity)}Repository();
            }
            return File${stringCapitalize(entity)}Repository._instance;
        }

        private static _readFile(): ${stringCapitalize(entity)}[] {
            try {
                if (!fs.existsSync(File${stringCapitalize(entity)}Repository._path)) {
                    return [];
                }
                const data = fs.readFileSync(File${stringCapitalize(entity)}Repository._path, 'utf-8');
                return JSON.parse(data);
            } catch (error) {
                throw new ${stringCapitalize(entity)}CreateException(
                    'Failed to read file.',
                    ${stringCapitalize(entity)}CreateErrorCode.FILE_READ_ERROR,
                );
            }
        }

        private static _writeFile(${entity}s: ${stringCapitalize(entity)}[]): void {
            try {
                fs.writeFileSync(
                    File${stringCapitalize(entity)}Repository._path,
                    JSON.stringify(${entity}s, null, 2),
                );
            } catch (error) {
                throw new ${stringCapitalize(entity)}CreateException(
                    'Failed to write file.',
                    ${stringCapitalize(entity)}CreateErrorCode.FILE_WRITE_ERROR,
                );
            }
        }

        init(data: ${stringCapitalize(entity)}[]): ${stringCapitalize(entity)}[] {
            if (this.findAll().length === 0) {
                File${stringCapitalize(entity)}Repository._writeFile(data);
            }
            return data;
        }

        create(body: ${stringCapitalize(entity)}): ${stringCapitalize(entity)} {
            try {
                const ${entity}s = File${stringCapitalize(entity)}Repository._readFile();
                ${entity}s.push(body);
                File${stringCapitalize(entity)}Repository._writeFile(${entity}s);
                return body;
            } catch (error) {
                throw new ${stringCapitalize(entity)}CreateException(
                    'Failed to create ${entity}.',
                    ${stringCapitalize(entity)}CreateErrorCode.SERVICE_CREATE_FAILED,
                );
            }
        }

        delete(id: string): ${stringCapitalize(entity)} {
            try {
                const ${entity}s = File${stringCapitalize(entity)}Repository._readFile();
                const index = ${entity}s.findIndex((${entity}) => ${entity}.id === id);
                if (index === -1) {
                    throw new ${stringCapitalize(entity)}CreateException(
                        '${stringCapitalize(entity)} not found.',
                        ${stringCapitalize(entity)}CreateErrorCode.SERVICE_NOT_FOUND,
                    );
                }
                const [deleted${stringCapitalize(entity)}] = ${entity}s.splice(index, 1);
                File${stringCapitalize(entity)}Repository._writeFile(${entity}s);
                return deleted${stringCapitalize(entity)};
            } catch (error) {
                throw new ${stringCapitalize(entity)}CreateException(
                    'Failed to delete ${entity}.',
                    ${stringCapitalize(entity)}CreateErrorCode.SERVICE_DELETE_FAILED,
                );
            }
        }

        findAll(): ${stringCapitalize(entity)}[] {
            try {
                return File${stringCapitalize(entity)}Repository._readFile();
            } catch (error) {
                throw new ${stringCapitalize(entity)}CreateException(
                    'Failed to find ${entity}s.',
                    ${stringCapitalize(entity)}CreateErrorCode.SERVICE_FETCH_FAILED,
                );
            }
        }

        update(id: string, body: ${stringCapitalize(entity)}): ${stringCapitalize(entity)} {
            try {
                const ${entity}s = File${stringCapitalize(entity)}Repository._readFile();
                const index = ${entity}s.findIndex((${entity}) => ${entity}.id === id);
                if (index === -1) {
                    throw new ${stringCapitalize(entity)}CreateException(
                        '${stringCapitalize(entity)} not found.',
                        ${stringCapitalize(entity)}CreateErrorCode.SERVICE_NOT_FOUND,
                    );
                }
                ${entity}s[index] = { ...${entity}s[index], ...body };
                File${stringCapitalize(entity)}Repository._writeFile(${entity}s);
                return ${entity}s[index];
            } catch (error) {
                throw new ${stringCapitalize(entity)}CreateException(
                    'Failed to update ${entity}.',
                    ${stringCapitalize(entity)}CreateErrorCode.SERVICE_UPDATE_FAILED,
                );
            }
        }
    }


    `;
}
