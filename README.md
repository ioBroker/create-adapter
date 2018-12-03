# create-adapter
Command line utility to quickly create a new adapter or VIS widget for [ioBroker](https://github.com/ioBroker):

<img src="docs/screenshot.png">

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
* IntelliSense (auto completion and tooltips) in supporting editors based on the [ioBroker declaration files](https://www.npmjs.com/package/@types/iobroker)
* JavaScript with the following optional tools:
  * [ESLint](https://github.com/eslint/eslint) for code quality
  * Type checking based on the ioBroker declarations
* Or TypeScript with the following optional tools:
  * [TSLint](https://github.com/palantir/tslint) for code quality
  * [nyc](https://github.com/istanbuljs/nyc) for code coverage
* Choice between indentation: tabs or 4 spaces
* Predefined settings page for the admin UI
* Choice of an OpenSource license and automatic creation of the license file
* Built-in component tests using `mocha` & `chai`, `sinon` (w/ `sinon-chai`) for:
  * Correctly defined package files
  * And your own tests...
* Automated testing using Travis CI

## Roadmap
The following features did not make it into v1.0.0 and are planned for a later release:
- [ ] [React](https://reactjs.org/) as an alternative to plain HTML+CSS for the admin UI (some predefined helpful methods included)
- [ ] An extra tab for the admin UI (including React support)
- [ ] Strongly typed `adapter.config` properties in TypeScript (they are supported in JS though!)
- [ ] Package scripts for automatic semantic release of new versions
- [ ] Choice of start mode
- [ ] Ask for:
  * adapter title
  * keywords
  * short description

## Developing
For developers of this package, there are a few things to know:

* `npm run build` creates a fresh build and deletes old build files. This is necessary when template files are renamed or deleted, as the compiled files will still be there.
* `npm run watch` keeps compiling incremental changes after a fresh build.
* `src/templates` contains a bunch of templates, which are basically TypeScript files exporting a single method: 
  * This method accepts an object with the user's answers and returns a `string` or `Promise<string>` containing the output file.
  * Setting the `customPath` property of that method allows you to override the output path of the file, either constant or depending on the user's answers (function).
  * The outputted files are automatically formatted to have the correct indentation and multiple empty lines are removed. If you don't want this, set `noReformat` to true.

* Publishing requires the `--access public` option.
