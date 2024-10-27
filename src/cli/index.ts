// index.ts
import { EntityBuilder } from './entity-builder';

async function main() {
    const command = process.argv[2];
    const entityName = process.argv[3];

    if (!command || !entityName) {
        console.error('Uso: npm run create [comando] [entidade]');
        process.exit(1);
    }

    const builder = new EntityBuilder();
    await builder.create(command, entityName);
}

main();
