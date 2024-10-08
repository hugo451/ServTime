import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import nodePlugin from 'eslint-plugin-node';

export default [
    {
        ignores: ['node_modules/**', 'dist/**', '*.js', '*.d.ts'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
            node: nodePlugin,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'error',
            'node/no-unsupported-features/es-syntax': [
                'error',
                { ignores: ['modules'] },
            ],
        },
    },
];
