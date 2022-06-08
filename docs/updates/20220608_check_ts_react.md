# Check TS-React code using separate tsconfig files for src and admin

The npm script _check_ needs to run two checks with the associated tsconfig files for adapter src and admin src separately.
Otherwise the check will fail with `error TS17004: Cannot use JSX unless the '--jsx' flag is provided`.

To make use of this, edit your `package.json` file in the `"scripts"` section as follows:

```diff
-    "check": "tsc --noEmit",
+    "check": "tsc --noEmit && tsc --noEmit -p admin/tsconfig.json",
```

Also update your main `tsconfig.json` file like:

```diff
        "include": [
-               "src/**/*.ts",
-               "admin/**/*.ts",
-               "admin/**/*.tsx"
+               "src/**/*.ts"
        ],
        "exclude": [
+               "admin/**",
                "build/**",
                "node_modules/**"
        ]
```