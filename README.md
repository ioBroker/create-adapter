# <img src="adapter-creator.png" width="48" height="48" style="vertical-align: middle" />&nbsp;<span style="vertical-align: middle">ioBroker adapter creator</span>

Command line utility to quickly create a new adapter or VIS widget for [ioBroker](https://github.com/ioBroker):

<img src="docs/screenshot.png">

[
![node](https://img.shields.io/node/v/@iobroker/create-adapter.svg)
![npm](https://img.shields.io/npm/v/@iobroker/create-adapter.svg)
](https://www.npmjs.com/package/@iobroker/create-adapter)
[
![Build Status](https://img.shields.io/travis/ioBroker/create-adapter/master.svg)
](https://travis-ci.org/ioBroker/create-adapter)
![License](https://img.shields.io/npm/l/@iobroker/create-adapter.svg)
[
![Changelog](https://img.shields.io/badge/read-Changelog-blue.svg)
](CHANGELOG.md)

## Prerequisites

Any computer with NodeJS in version 8 or higher and npm 6 or higher.

## Usage

This tool is not supposed to be installed. Instead, run the most recent version using

```
npx @iobroker/create-adapter [options]
```

in the directory where the directory of your project should be created. You don't need to create the adapter/widget directory, because it will be created for you.
**WARNING:** If the path contains a space, this [won't work](https://github.com/npm/npx/issues/14).

After a short while, you will be asked a few questions. Afterwards all the necessary files will be created for you.

### Options

The following CLI options are available:

-   `--target=/path/to/dir` - Specify which directory the adapter files should be created in (instead of the current dir)
-   `--skipAdapterExistenceCheck` - Don't check if an adapter with the same name already exists on `npm`.

## Features

-   Choose between: ioBroker adapter, VIS widget or both
-   Ask for package metadata (with automatic translation):
    -   Title (mandatory)
    -   Short description (optional)
    -   Adapter start mode
    -   Adapter/VIS category
    -   Keywords (optional)
-   IntelliSense (auto completion and tooltips) in supporting editors based on the [ioBroker declaration files](https://www.npmjs.com/package/@types/iobroker)
-   JavaScript with the following optional tools:
    -   [ESLint](https://github.com/eslint/eslint) for code quality
    -   Type checking based on the ioBroker declarations
-   Or TypeScript with the following optional tools:
    -   [ESLint](https://github.com/eslint/eslint) for code quality
    -   Automatic formatting with [Prettier](https://github.com/prettier/prettier/)
    -   [nyc](https://github.com/istanbuljs/nyc) for code coverage
-   Choose between indentation: tabs or 4 spaces
-   Choose your preferred quote style
-   Integration in the ioBroker admin UI:
    -   Settings page
    -   An extra tab (optional)
    -   Custom datapoint-specific options (optional)
-   Predefined settings page for the admin UI
-   Choice of an OpenSource license and automatic creation of the license file
-   Built-in component tests using `mocha`, `chai` (with `chai-as-promised`) and `sinon` (with `sinon-chai`) for:
    -   Correctly defined package files
    -   and your own tests...
-   Automated testing using Github Actions or Travis CI

## Roadmap

The following features did not make it into v1.0.0 and are planned for a later release:

-   [ ] [React](https://reactjs.org/) as an alternative to plain HTML+CSS for the admin UI (some predefined helpful methods included)
-   [ ] Strongly typed `adapter.config` properties in TypeScript (they are supported in JS though!)
-   [ ] Package scripts for automatic semantic release of new versions
-   [ ] Automatically open the folder in your favorite editor
-   [ ] Scripts/Helpers for remote debugging

## Developing

First of all: **DO NOT** push changes to `master` directly! Just don't. Every change should be done through PRs, which have a template with a checklist to fill out.
This makes sure that `master` always works and every change is documented.

For developers of this package, there are a few things to know:

-   `npm run build` creates a fresh build and deletes old build files. This is necessary when template files are renamed or deleted, as the compiled files will still be there.
-   `npm run watch` keeps compiling incremental changes whenever you save a source file.
-   The directory `/templates` contains a bunch of templates, which are basically TypeScript files exporting a single method:
    -   This method accepts an object with the user's answers and returns a `string` or `Promise<string>` containing the output file.
    -   The last extension (`.ts`) is removed when creating the output file. Setting the `customPath` property of the template method allows you to override the output path of the file, either a constant or depending on the user's answers (function).
    -   The outputted files are automatically formatted to have the correct indentation and multiple empty lines are removed. If you don't want this, set `noReformat` to true.
-   Test your changes with `npm test` and/or write relevant tests. For a couple of representative combination of answers, baseline adapter directories are generated. If those baselines are changed as a result of your changes, please review if those changes are desired.

## Publishing

Do not publish directly using `npm`. Instead create a new release with the release script `npm run release ...`. This creates a tag on github, performs a test run on TravisCI and after a successful build automatically publishes to npm.

You can semantically increase the version and publish it by using

```bash
npm run release [<releaseType> [<postfix>]] [-- --dry]
```

(preferably) or set a specific version by using

```bash
npm run release <version> [-- --dry]
```

The option `-- --dry` (don't forget the first pair of dashes) performs a dry run without updating files.
The available release types are:

-   `major`
-   `premajor`
-   `minor`
-   `preminor`
-   `patch`
-   `prepatch`
-   `prerelease`

and the `pre-...` versions allow you to append a postfix like `-beta`.
