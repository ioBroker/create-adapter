# Enable TypeScript sourcemaps

Sourcemaps allow debugging the original TypeScript code, even when ioBroker executes the compiled JS files. Furthermore, the error messages in ioBroker also reference the original ts files if you enable sourcemaps. To make use of this in your existing adapters, do the following changes:

1. Change `tsconfig.json` as follows:

    ```diff
    - "sourceMap": false,
    + "sourceMap": true,
    ```

2. In `.gitignore` and `.npmignore` remove these entries if they exist:
    ```
    maps/
    *.maps
    ```
