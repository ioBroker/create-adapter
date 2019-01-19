# <img src="adapter-creator.png" width="48" height="48" style="vertical-align: middle" />&nbsp;<span style="vertical-align: middle">ioBroker adapter creator</span>

Command line utility to quickly create a new adapter or VIS widget for [ioBroker](https://github.com/ioBroker):

<img src="docs/screenshot.png">

[Changelog](CHANGELOG.md)

<!--
TODO: Setup testing and display badges
[![node](https://img.shields.io/node/v/@iobroker/create-adapter.svg) ![npm](https://img.shields.io/npm/v/@iobroker/create-adapter.svg)](https://www.npmjs.com/package/@iobroker/create-adapter)

[![Build Status](https://img.shields.io/circleci/project/github/AlCalzone/create-adapter.svg)](https://circleci.com/gh/AlCalzone/create-adapter)
[![Coverage Status](https://img.shields.io/coveralls/github/AlCalzone/create-adapter.svg)](https://coveralls.io/github/AlCalzone/create-adapter)
-->

## Prerequisites
Any computer with NodeJS in version 8 or higher and npm 6 or higher.

## Usage
This tool is not supposed to be installed. Instead, run the most recent version using
```
npx @iobroker/create-adapter
```
in the directory where the directory of your project should be created. You don't need to create the adapter/widget directory, because it will be created for you.

After a short while, you will be asked a few questions. Afterwards all the necessary files will be created for you.


## Features
* Choose between: ioBroker adapter, VIS widget or both
* Ask for package metadata (with automatic translation):
  * Title (mandatory)
  * Short description (optional)
  * Adapter start mode
  * Adapter/VIS category
* IntelliSense (auto completion and tooltips) in supporting editors based on the [ioBroker declaration files](https://www.npmjs.com/package/@types/iobroker)
* JavaScript with the following optional tools:
  * [ESLint](https://github.com/eslint/eslint) for code quality
  * Type checking based on the ioBroker declarations
* Or TypeScript with the following optional tools:
  * [TSLint](https://github.com/palantir/tslint) for code quality
  * [nyc](https://github.com/istanbuljs/nyc) for code coverage
* Choose between indentation: tabs or 4 spaces
* Choose your preferred quote style
* Predefined settings page for the admin UI
* Choice of an OpenSource license and automatic creation of the license file
* Built-in component tests using `mocha` & `chai` (with `chai-as-promised`), `sinon` (with `sinon-chai`) for:
  * Correctly defined package files
  * and your own tests...
* Automated testing using Travis CI

## Roadmap
The following features did not make it into v1.0.0 and are planned for a later release:
- [ ] [React](https://reactjs.org/) as an alternative to plain HTML+CSS for the admin UI (some predefined helpful methods included)
- [ ] An extra tab for the admin UI (including React support)
- [ ] Strongly typed `adapter.config` properties in TypeScript (they are supported in JS though!)
- [ ] Package scripts for automatic semantic release of new versions
- [ ] Ask for:
  * keywords
- [ ] Automatically open the folder in your favorite editor
- [ ] Scripts/Helpers for remote debugging

## Developing
For developers of this package, there are a few things to know:

* `npm run build` creates a fresh build and deletes old build files. This is necessary when template files are renamed or deleted, as the compiled files will still be there.
* `npm run watch` keeps compiling incremental changes whenever you save a source file.
* `src/templates` contains a bunch of templates, which are basically TypeScript files exporting a single method: 
  * This method accepts an object with the user's answers and returns a `string` or `Promise<string>` containing the output file.
  * The last extension (`.ts`) is removed when creating the output file. Setting the `customPath` property of the template method allows you to override the output path of the file, either a constant or depending on the user's answers (function).
  * The outputted files are automatically formatted to have the correct indentation and multiple empty lines are removed. If you don't want this, set `noReformat` to true.
* Test your changes with `npm test` and/or write relevant tests. For a couple of representative combination of answers, baseline adapter directories are generated. If those baselines are changed as a result of your changes, please review if those changes are desired.

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
* `major`
* `premajor`
* `minor`
* `preminor`
* `patch`
* `prepatch`
* `prerelease`

and the `pre-...` versions allow you to append a postfix like `-beta`.
