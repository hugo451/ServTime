import { BaseHandler } from './base.handler';
import { mkdir } from 'fs/promises';
import { join } from 'path';

export class DirectoriesHandler extends BaseHandler {
    protected shouldHandle(command: string): boolean {
        return command === 'directories' || command === 'module';
    }

    protected async execute(entityName: string): Promise<void> {
        const baseDir = join('src', 'entities', entityName.toLowerCase());
        const dirs = [
            baseDir,
            join(baseDir, 'dto'),
            join(baseDir, 'exceptions'),
            join(baseDir, 'repositories'),
            join(baseDir, 'repositories/factory'),
        ];

        for (const dir of dirs) {
            await mkdir(dir, { recursive: true });
            console.log(`Directory created: ${dir}`);
        }
    }
}
