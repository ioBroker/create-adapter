# ESLint 9 with Flat Config and Official ioBroker ESLint Configuration

ESLint 9 with the new flat config format is now the default for new adapters. You have two migration options:

## Option 1: Migrate to Official ioBroker ESLint Config (Recommended)

The official `@iobroker/eslint-config` package provides a standardized, maintained ESLint configuration that includes Prettier integration. This is the recommended approach for most adapters as it ensures consistency across the ioBroker ecosystem and reduces maintenance overhead.

### Benefits
- Centrally maintained configuration
- Automatic updates with best practices
- Prettier integration included
- Consistent code style across ioBroker adapters
- Less configuration to maintain

### Step 1: Update dependencies

Remove old ESLint-related dependencies and add the official config:

```diff
  "devDependencies": {
-   "eslint": "^8.x.x",
-   "@typescript-eslint/eslint-plugin": "^7.x.x",
-   "@typescript-eslint/parser": "^7.x.x",
-   "eslint-config-prettier": "^x.x.x",
-   "eslint-plugin-prettier": "^x.x.x",
+   "@iobroker/eslint-config": "^2.2.0",
    // ... other dependencies
  }
```

### Step 2: Create eslint.config.mjs

Replace your `.eslintrc.js` or `.eslintrc.json` with `eslint.config.mjs`:

**For TypeScript adapters:**
```js
// iobroker eslint configuration
import iobrokerEslintConfig from '@iobroker/eslint-config/iobroker.config.mjs';

export default [
	...iobrokerEslintConfig,
	{
		ignores: [
			'.dev-server/',
			'.vscode/',
			'*.test.js',
			'test/**/*.js',
			'*.config.mjs',
			'build',
			'dist',
			'admin/build/',
			'admin/words.js',
			'admin/admin.d.ts',
			'**/adapter-config.d.ts',
		]
	}
];
```

**For JavaScript adapters:**
```js
// iobroker eslint configuration
import iobrokerEslintConfig from '@iobroker/eslint-config/iobroker.config.mjs';

export default [
	...iobrokerEslintConfig,
	{
		ignores: [
			'.dev-server/',
			'.vscode/',
			'*.test.js',
			'test/**/*.js',
			'*.config.mjs',
			'admin/words.js',
		]
	}
];
```

### Step 3: Create prettier.config.mjs

If using Prettier, create `prettier.config.mjs`:

```js
// iobroker prettier configuration file
import prettierConfig from '@iobroker/eslint-config/prettier.config.mjs';

export default {
	...prettierConfig,
	// Adjust these to match your preferences:
	useTabs: true,        // or false for spaces
	singleQuote: false,   // or true for single quotes
};
```

### Step 4: Update lint script

Update your `package.json` lint script:

```diff
  "scripts": {
-   "lint": "eslint .",
+   "lint": "eslint -c eslint.config.mjs .",
    // ... other scripts
  }
```

### Step 5: Delete old config files

Remove these files if they exist:
- `.eslintrc.js` or `.eslintrc.json`
- `.eslintignore` (ignores are now in `eslint.config.mjs`)
- `.prettierrc.js` (replaced by `prettier.config.mjs`)

### Step 6: Update VSCode settings (optional)

Add Prettier extension to `.vscode/extensions.json` for TypeScript projects:

```diff
  "recommendations": [
    "dbaeumer.vscode-eslint",
+   "esbenp.prettier-vscode",
    // ... other extensions
  ]
```

---

## Option 2: Upgrade to ESLint 9 with Custom Configuration

If you prefer to maintain your own ESLint configuration, you can upgrade to ESLint 9 while keeping full control over your rules.

### Benefits
- Full control over all ESLint rules
- Custom rule configurations
- Flexibility for project-specific needs

### Step 1: Update ESLint dependencies

Upgrade ESLint and related packages to version 9:

```diff
  "devDependencies": {
-   "eslint": "^8.x.x",
+   "eslint": "^9.15.0",
+   "@eslint/js": "^9.15.0",
-   "@typescript-eslint/eslint-plugin": "^7.x.x",
-   "@typescript-eslint/parser": "^7.x.x",
+   "@typescript-eslint/eslint-plugin": "^8.15.0",
+   "@typescript-eslint/parser": "^8.15.0",
    // ... other dependencies
  }
```

### Step 2: Convert to flat config format

Create `eslint.config.mjs` to replace `.eslintrc.js`:

**For TypeScript adapters:**
```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.mocha,
			},
			parserOptions: {
				projectService: true,
			},
		},
		rules: {
			'prefer-template': 'error',
			'no-unused-vars': 'off',
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			...tseslint.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
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
			'build',
			'dist',
			'admin/build/',
			'admin/words.js',
			'admin/admin.d.ts',
			'**/adapter-config.d.ts',
		],
	},
];
```

**For JavaScript adapters:**
```js
import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.mocha,
			},
		},
		rules: {
			'prefer-template': 'error',
			'no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
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
			'admin/words.js',
		],
	},
];
```

### Step 3: Add globals package

If you're using globals in your config:

```bash
npm install --save-dev globals
```

### Step 4: Update lint script

Update your `package.json` lint script:

```diff
  "scripts": {
-   "lint": "eslint .",
+   "lint": "eslint -c eslint.config.mjs .",
    // ... other scripts
  }
```

### Step 5: Delete old config files

Remove these files:
- `.eslintrc.js` or `.eslintrc.json`
- `.eslintignore` (ignores are now in `eslint.config.mjs`)

### Step 6: Add VIS widget support (if applicable)

If your adapter includes VIS widgets, add special configuration for them:

```js
export default [
	// ... your existing config
	{
		files: ['widgets/**/*.js'],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: 'script',
			globals: {
				...globals.browser,
				$: 'readonly',
				jQuery: 'readonly',
				vis: 'readonly',
			},
		},
		rules: {
			'no-var': 'off',
			'prefer-const': 'off',
			'prefer-template': 'off',
		},
	},
];
```

---

## Common Steps for Both Options

### Install dependencies

After updating your `package.json`:

```bash
npm install
```

### Run lint and fix issues

```bash
npm run lint
```

Fix any issues reported. Many can be auto-fixed:

```bash
npm run lint -- --fix
```

### Test your adapter

Ensure everything still works:

```bash
npm test
npm run build  # for TypeScript adapters
```

---

## Key Differences in ESLint 9

- **Flat config format**: Uses JavaScript modules instead of JSON/commonjs
- **No `.eslintignore`**: Ignores are now part of the config file
- **Different plugin loading**: Plugins are imported and used differently
- **Improved performance**: Faster execution with the new architecture

## Need Help?

- [ESLint 9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files)
- [ioBroker Forum](https://forum.iobroker.net)
