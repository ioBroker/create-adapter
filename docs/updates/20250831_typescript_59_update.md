# Update TypeScript to 5.9.x for existing adapters

TypeScript 5.9.x is now the default version for new adapters created with this tool. This guide shows how to manually update existing TypeScript adapters to use the latest features and best practices.

## Update TypeScript version

Update the TypeScript version in your `package.json` devDependencies:

```diff
  "devDependencies": {
-   "typescript": "~5.0",
+   "typescript": "~5.9",
    // ... other dependencies
  },
```

## Update TypeScript ESLint packages (if using ESLint)

If your adapter uses ESLint with TypeScript support, update the TypeScript ESLint packages:

```diff
  "devDependencies": {
-   "@typescript-eslint/eslint-plugin": "^6.x.x",
-   "@typescript-eslint/parser": "^6.x.x",
+   "@typescript-eslint/eslint-plugin": "^7.18.0",
+   "@typescript-eslint/parser": "^7.18.0",
    // ... other dependencies
  },
```

## Add consistent-type-imports ESLint rule (recommended)

If you're using ESLint, consider adding the `consistent-type-imports` rule to improve your type imports. Add this to your `.eslintrc.js` in the `rules` section:

```diff
  rules: {
    // ... other rules
+   // Avoid runtime imports that are unnecessary
+   "@typescript-eslint/consistent-type-imports": [
+     "error",
+     {
+       disallowTypeAnnotations: false,
+     },
+   ],
  },
```

## Update type imports

With the new ESLint rule, you should use `type` imports for types that are only used for type annotations:

```diff
- import { SomeType, someFunction } from "some-module";
+ import type { SomeType } from "some-module";
+ import { someFunction } from "some-module";
```

You can automatically fix many of these with:

```bash
npm run lint -- --fix
```

## Install dependencies

After updating your `package.json`, install the new dependencies:

```bash
npm install
```

## Build and test

Make sure your adapter still builds and works correctly:

```bash
npm run build
npm test
```

## TypeScript 5.9 features

TypeScript 5.9 includes several improvements:
- Better inference with higher-order functions
- Improved error messages
- Performance improvements
- Support for modern JavaScript features

For a full list of changes, see the [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html).

## Note

The TypeScript 5.9.x series maintains backward compatibility with most TypeScript 5.x code, so this update should be relatively safe for existing projects. However, always test thoroughly after upgrading.