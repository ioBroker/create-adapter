import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                'process': 'readonly',
                'Buffer': 'readonly',
                '__dirname': 'readonly',
                '__filename': 'readonly',
                'module': 'readonly',
                'require': 'readonly',
                'exports': 'readonly',
                'global': 'readonly',
                'console': 'readonly',
                'setTimeout': 'readonly',
                'setInterval': 'readonly',
                'clearTimeout': 'readonly',
                'clearInterval': 'readonly',
                'document': 'readonly',
                'window': 'readonly',
                'describe': 'readonly',
                'it': 'readonly',
                'ioBroker': 'readonly',
            },
        },
        plugins: {
        },
        rules: {
            ...js.configs.recommended.rules,
            'indent': [
                'error',
                4,
                {
                    'SwitchCase': 1
                }
            ],
            'quotes': [
                'error',
                'single'
            ],
            'no-unused-vars': [
                'warn',
                {
                    'ignoreRestSiblings': true,
                    'argsIgnorePattern': '^_',
                    'varsIgnorePattern': '^_'
                }
            ],
        },
    },
    {
        ignores: [
            '.dev-server/',
            '.vscode/',
            '*.test.js',
            'test/**/*.js',
            '*.config.mjs',
            'build/',
            'dist/',
            'admin/build/',
            'admin/words.js',
            'admin/admin.d.ts',
            'admin/blockly.js',
            '**/adapter-config.d.ts',
        ],
    },
];