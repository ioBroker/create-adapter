# Update ESLint config for `eslint-config-prettier` v8

The update to v8 broke linting for adapters that use Prettier. To fix it, remove the following line from `extends` in `.eslintrc.js`:

```
'prettier/@typescript-eslint', // Uses eslint-config-prettier to ...
```
