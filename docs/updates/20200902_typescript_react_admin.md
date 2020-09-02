# Support for React in admin UI (TypeScript only)

Migration guide:

-   Add `"jsx": "react"` to `compilerOptions` in `tsconfig.json`
-   Install additional `devDependencies`:
    ```bash
    npm i -D @babel/cli @babel/core @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators @babel/plugin-proposal-nullish-coalescing-operator @babel/plugin-proposal-numeric-separator @babel/plugin-proposal-optional-chaining @babel/preset-env @babel/preset-typescript @types/jquery @types/materialize-css @types/react @types/react-dom parcel-bundler react react-dom
    ```
-   Add the following scripts to `package.json`:
    ```json
    "build:parcel": "parcel build admin/src/index.tsx -d admin/build",
    "watch:parcel": "parcel admin/src/index.tsx -d admin/build ",
    ```
-   Change the `build` script in `package.json`:
    ```json
    "build": "npm run build:ts && npm run build:parcel",
    ```
-   Copy `.babelrc` and the entire `admin` folder from here https://github.com/ioBroker/create-adapter/tree/f49d6aec3ec69da515f26ba46a33756b54ff967a/test/baselines/adapter_TS_React

You'll find the new admin sources in `admin/src`. To compile the UI, run `npm run build:parcel` (once) or `npm run watch:parcel` for continuous development.
