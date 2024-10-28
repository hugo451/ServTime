import { stringCapitalize } from '../../utils/string-capitalize';

export function inMemoryRepositoryTemplate(entity: string): string {
    return `
    import { Repository } from '../../repository';
    import { ${stringCapitalize(entity)} } from '../${entity}';

    export class ${stringCapitalize(entity)}List extends Repository<${stringCapitalize(entity)}> {
        private static _instance: ${stringCapitalize(entity)}List;
        private list: ${stringCapitalize(entity)}[];

        private constructor(list?: ${stringCapitalize(entity)}[]) {
            super();
            this.list = list || [];
        }

        public static get instance(): ${stringCapitalize(entity)}List {
            if (!${stringCapitalize(entity)}List._instance) {
                ${stringCapitalize(entity)}List._instance = new ${stringCapitalize(entity)}List();
            }
            return ${stringCapitalize(entity)}List._instance;
        }

        init(data: ${stringCapitalize(entity)}[]): ${stringCapitalize(entity)}[] {
            if (this.list.length === 0) {
                this.list = data;
            }
            return Array.from(this.list) as ${stringCapitalize(entity)}[];
        }

        create(body: ${stringCapitalize(entity)}): ${stringCapitalize(entity)} {
            this.list.push(body);
            return body;
        }

        find(id: string): ${stringCapitalize(entity)} | undefined {
            return this.list.find((${entity}) => ${entity}.id === id);
        }

        delete(id: string): ${stringCapitalize(entity)} {
            const ${entity} = this.find(id);
            if (!${entity}) {
                throw new Error('${stringCapitalize(entity)} not found.');
            }
            const index = this.list.findIndex((${entity}) => ${entity}.id === id);
            this.list.splice(index, 1);
            return ${entity};
        }

        findAll(): ${stringCapitalize(entity)}[] {
            return Array.from(this.list) as ${stringCapitalize(entity)}[];
        }

        update(id: string, body: ${stringCapitalize(entity)}): ${stringCapitalize(entity)} {
            const ${entity} = this.find(id);
            if (!${entity}) {
                throw new Error('${stringCapitalize(entity)} not found.');
            }
            const index = this.list.findIndex((${entity}) => ${entity}.id === id);
            this.list[index] = body;
            return body;
        }
    }

    `;
}
