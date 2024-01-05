# Simplify maintenance of ESLint config by using the `"latest"` parser version

Previously, ESLint required the developer to specify which ECMAScript version to use for parsing. When using newer JavaScript features, this setting had to be changed for ESLint to work.
It is now possible to set the field to `"latest"`, which will make further changes unnecessary.

To do this, edit the ESLint config as follows (2022 can be a diffent number currently):

**If you have a file `.eslintrc.json`:**

```diff
  "parserOptions": {
-    "ecmaVersion": 2022,
+    "ecmaVersion": "latest",
```

**If you have a file `.eslintrc.js`:**

```diff
  parserOptions: {
-    ecmaVersion: 2022,
+    ecmaVersion: "latest",
```
