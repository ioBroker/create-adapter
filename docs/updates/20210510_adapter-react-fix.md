# Fix adapter-react dependencies

Up until version 1.6.14 of `@iobroker/adapter-react` one had to manually add dependencies to the package.json file. This is now obsolete.

You may update your `devDependencies` in `package.json` as follows:

-   explicitly set `@iobroker/adapter-react` to version `1.6.15`
-   remove any indirect dependencies if you are not using them:
    -   `@material-ui/icons`
    -   `react-icons`
    -   `@sentry/browser`

Your `package.json` should now look similar to:

-   [this](./../../test/baselines/adapter_JS_React/package.json) for JavaScript
-   [this](./../../test/baselines/adapter_TS_React/package.json) for TypeScript

After these modifications, call `npm install` in your adapter root directory.
