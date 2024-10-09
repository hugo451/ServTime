import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,js}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node, // Alterando para o ambiente Node.js
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    // argsIgnorePattern: '^_',
                    // varsIgnorePattern: '^_', // Ignorando variáveis que começam com _
                    caughtErrorsIgnorePattern: 'error', // Ignorar erros em blocos catch começando com _
                },
            ],
        },
        ignores: [
            '**/*.test.{js,ts}',
            '**/*.test-*.ts',
            '**/dist/**',
            '**/templates/**',
            'coverage/**',
            'node_modules/',
        ],
    },
);
