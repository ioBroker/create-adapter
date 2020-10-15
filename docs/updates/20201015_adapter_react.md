# Use `@iobroker/adapter-react` as base for React admin UI

This migration is **only relevant** if you're using TypeScript and a **React UI** for Admin.

If you created a complex React UI, this migration will take some time; you may decide not to migrate to `adapter-react` for this reason.
Just keep in mind you won't profit from future improvements to the React UI in `create-adapter`.

## Migration

### Configuration

1. Update `.eslint.rc` to look like [this](../../test/baselines/adapter_TS_React/.eslint.rc)
    - Add ECMA Feature JSX
    - Extend the rules from `plugin:react/recommended`
    - Add the plugin `react`
    - Set the React version to `detect`
1. Update `package.json`
    - Add the latest version of the following packages as dev dependency:
        - `@iobroker/adapter-react`
        - `@material-ui/core`
        - `@material-ui/icons`
        - `eslint-plugin-react`
        - `react-icons`
    - Remove the following packages:
        - `@types/jquery`
    - `@types/materialize-css`

### ioBroker Types

1. Add the file `src/lib/adapter-config.d.ts` with your adapter configuration similar to [this](../../test/baselines/adapter_TS_React/lib/adapter-config.d.ts).
1. Remove the following files because all methods related to ioBroker communication are now taken from `@iobroker/adapter-react` (see also under "Admin Content"):
    - `lib/admin.d.ts`
    - `lib/backend.ts`

### Admin Content

1. Update `admin/index_m.html` to look like [this](../../test/baselines/adapter_TS_React/admin/index_m.html)
    - You shouldn't have to edit this file during development.
1. Update `admin/src/index.tsx` to look like [this](../../test/baselines/adapter_TS_React/admin/src/index.tsx)
    - Ensure you use your own adapter name (without "iobroker.") in the line `window["adapterName"] = "YOUR ADAPTER NAME HERE";`
1. Remove `admin/words.js` and put all translations in JSON files:
    - Path: `admin/src/i18n/[language].json`
    - One file for each language
    - JSON format: [key-value pairs](../../test/baselines/adapter_TS_React/admin/src/i18n/en.tsx)
1. Create your UI in `admin/src/app.tsx` and linked files
    - You sould start from [admin/src/app.tsx](../../test/baselines/adapter_TS_React/admin/src/app.tsx)
    - You can look at [admin/src/components/settings.tsx](../../test/baselines/adapter_TS_React/admin/src/components/settings.tsx) for some inspiration
    - Use components from `@material-ui` (MUI) where possible. Examples:
        - Text Field in `@material-ui/core/TextField`
        - Checkbox in `@material-ui/core/Checkbox`
        - Dropdown in `@material-ui/core/Select`
    - Use built-in types from ioBroker where possible.
        - Documentation: https://github.com/ioBroker/adapter-react/#components
        - Examples:
            - Tab Container
            - Dialogs (Message, Confirm, Error, Text Input, Select Object ID)
            - File Browser
            - Icons (Copy, Expert, ...)
    - For advanced communication with the ioBroker host, the class `Connection` provides all possible methods
        - get / set objects, states, ...
        - subscribe to objects and states
        - send messages
        - ... and many more
