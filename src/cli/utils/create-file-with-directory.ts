import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function createFileWithDirectory(
    entityName: string,
    fileName: string,
    content: string,
): Promise<void> {
    // Definindo a estrutura de pastas para a entidade
    const baseDir = join('src', 'entities', entityName.toLowerCase());
    const dirPath = baseDir; // Base path for the entity

    // Criando o diretório se não existir
    await mkdir(dirPath, { recursive: true });

    // Definindo o caminho completo do arquivo
    const filePath = join(dirPath, fileName);

    // Escrevendo o arquivo
    await writeFile(filePath, content);
    console.log(`File created at ${filePath}`);
}
