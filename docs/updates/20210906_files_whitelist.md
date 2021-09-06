# Remove `.npmignore` blacklist, use `files` whitelist in `package.json` instead

`npm` has two ways of controlling which files end up in the published package: Blacklisting with `.npmignore` and whitelisting with `files` in `package.json`. Blacklisting often means forgetting things and publishing unnecessary, sometimes private files. For that reason we've switched to whitelisting.

To migrate, delete your `.npmignore` and add a `"files"` field in your `package.json`, preferably under `"main"` so it is all in one place. This field also supports glob patterns, so you can add entire directory structures with a single entry.

Here's an example for a TypeScript adapter:

```diff
   "main": "build/main.js",
+  "files": [
+    "admin{,/!(src)/**}/*.{html,css,png,svg,jpg,js}",
+    "admin/build/",
+    "build/",
+    "www/",
+    "io-package.json",
+    "LICENSE"
+  ],
```

Depending on your used features, these entries should work in 99% of the cases:

-   All adapters/widgets/etc.: `"io-package.json"` and `"LICENSE"`
-   Any adapter with an admin config page: `"admin{,/!(src)/**}/*.{html,css,png,svg,jpg,js}"`  
    This includes all html, css, png, svg, jpg and javascript files in the admin directory, **except** the `src` subdirectory.
-   An adapter with a React UI: `"admin/build/"`
-   TypeScript adapters: `"build/"`
-   Non-TypeScript adapters: `"main.js"` (or however your main file is called) and (probably) `"lib/"`
-   Adapters with widgets: `"widgets/"`
-   Adapters which provide a UI via the web adapter: `"www/"`

Note that some adapters may require additional files or directories to be included.
