# Add Ukrainian translation

## `io-package.json`

Add the missing `uk` translation to `news` / `titleLang` and `desc`.
If you use the [release-script](https://github.com/AlCalzone/release-script), the `uk` translation will be automatically added to `news` for all new versions.

## `Non-React Adapters`

If you still have an old adapter that still uses `admin/words.js`, then add the `uk` translation to `words.js`.

```diff
'test-adapter adapter settings': {
	// ... other languages
        'pl': 'Ustawienia adaptera dla test-adapter',
    +   'uk': 'Налаштування адаптера для test-adapter',
        'zh-cn': 'test-adapter的适配器设置'
    },
```

## `React Adapters`

add a new file `uk.json` in `admin/src/i18n` which contains the translation for the ukrainian language.
Run the `npm run translate` script to update the translation automatically or enter the missing translations manually.

```diff
+ {
+    "test-adapter adapter settings": "Налаштування адаптера для test-adapter",
+    "your key": "yout translation",
+    ... other translations
+ }
```

Add the new language to the `app.jsx` / `app.tsx` file in `admin/src`, if you use a `tab` you have to add the new language in the `tab-app.jsx` / `tab-app.tsx` file.

```diff
translations: {
	// ... other languages
	"pl": require("./i18n/pl.json"),
+	"uk": require("./i18n/uk.json"),
	"zh-cn": require("./i18n/zh-cn.json"),
},
```

## `JsonConfig Adapter`

Add a new folder in `admin/i18n` with the name `uk` and in the folder a `translations.json` which contains the translation for the ukrainian language.

Run the script `npm run translate` to update the translation automatically or enter the missing translations manually.

```diff
+ {
+    "test-adapter adapter settings": "Налаштування адаптера для test-adapter",
+    "your key": "yout translation",
+    ... other translations
+ }
```
