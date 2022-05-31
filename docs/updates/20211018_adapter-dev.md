# Use `@iobroker/adapter-dev` for automatic translations

What was previously done using `gulp` tasks can now be easily done using the script `translate-adapter` from the package [@iobroker/adapter-dev](https://github.com/ioBroker/adapter-dev).

## Migration

Simply follow these steps to switch from `gulp` to `@iobroker/adapter-dev`:

1. Remove the `gulpfile.js` in the root directory
1. Remove/modify the file `lib/tools.js` or `src/lib/tools.ts`
    - remove it if you don't include/require it anywhere in your adapter,
    - otherwise remove the functions `translateText()`, `translateYandex()` and `translateGoogle()`
1. Remove the following dev-dependencies from your `package.json`:
    - `gulp`
    - `@types/gulp` (if available)
    - `axios` (except if you are using it in other development tasks or in production)
1. Add the dev-dependency `@iobroker/adapter-dev`
1. Add the following to the `"scripts"` section of your `package.json`:

```json
    "translate": "translate-adapter",
```

## New commands

Now you can use the `translate` script instead of `gulp`:

| Old (gulp)                       | New (adapter-dev)             |
| -------------------------------- | ----------------------------- |
| `gulp translate`                 | `npm run translate translate` |
| `gulp adminWords2languages`      | `npm run translate to-json`   |
| `gulp adminLanguages2words`      | `npm run translate to-words`  |
| `gulp translateAndUpdateWordsJS` | `npm run translate all`       |

## More information

For further information, check the [official documentation](https://github.com/ioBroker/adapter-dev#readme).
