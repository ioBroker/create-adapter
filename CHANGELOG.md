# Changelog

<!--
	Placeholder for the next version:
	## __WORK IN PROGRESS__
	(at the beginning of a new line )
-->

## __WORK IN PROGRESS__
* (AlCalzone) Allow choosing the git remote protocol (HTTPS or SSH) (fixes #180)

## v1.14.0 (2019-05-09)
* (AlCalzone) Add the option to use Prettier as a formatter in TypeScript (#164)  
**Note:** This option also enables different auto-formatting settings in VSCode
* (AlCalzone) Use ESLint to fix quotes in TypeScript (#165)
* (AlCalzone) Use Prettier to format code if the option is set (#166)
* (AlCalzone) Describe `package.json` scripts in README (fixes #9)
* (AlCalzone) Add a getting started section to the README (fixes #12)

## v1.13.0 (2019-05-06)
* (AlCalzone) Remove extraneous quotes from "initial commit" (#159)
* (AlCalzone) Switch TypeScript templates to ESLint (#158)
* (AlCalzone) Fix `tsconfig.json` include for TypeScript projects (fixes #160)

## v1.12.1 (2019-04-29)
* (AlCalzone) Show the debug output during integration tests (#135)
* (AlCalzone) Migrate creator from TSLint to ESLint (and prettier) (#136)
* (AlCalzone & bluefox) Simplify Readme header (fixes #147)

## v1.12.0 (2019-04-29)
* (AlCalzone) In JS, make adapter config properties non-nullable
* (AlCalzone) Drop Node 6 from the test matrix when using object spreads in JS (fixes #127)
* (AlCalzone) Remove AppVeyor badge from readme, since all tests are on TravisCI (fixes #129)
* (AlCalzone) Use the correct quotes, even in uncommented lines (fixes #132)

## v1.11.0 (2019-03-13)
* (AlCalzone) Enforce `js-controller >= 1.4.2` during installation
* (AlCalzone) Added the `--skipAdapterExistenceCheck` CLI option to skip checking if an adapter already exists
* (AlCalzone) Disable `noImplicitAny` in JS since it annoys more than it helps

## v1.10.0 (2019-02-25)
* (AlCalzone) Add more unit tests
* (AlCalzone) Add the possibility to specify keywords (fixes #3)
* (AlCalzone) Bind event handlers in the ES6 templates to the class instance

## v1.9.0 (2019-02-14)
* (AlCalzone) Add the ability to pin package versions in the template `package.json`
* (AlCalzone & bluefox) Automatically translate settings labels in words.js (fixes #98)
* (AlCalzone & bluefox) Add the possibility to specify adapter config and generate options page (not on the CLI) (fixes #97)
* (AlCalzone) The `build` dir is no longer necessary on GitHub
* (AlCalzone) Respect `REQUEST_TIMEOUT` env variable when determining request timeout
* (AlCalzone) Test the template creation on every CI run
* (AlCalzone & bluefox) Add an indicator for the connection state (fixes #94)
* (AlCalzone & bluefox) Allow passing a custom icon as base64 or a Buffer (fixes #96)
* (bluefox) Use icon with a flat logo
* (AlCalzone & bluefox) Use HTTPS proxy when defined as an env variable (fixes #95)
* (bluefox) Provide `fetchPackageVersions` with a fallback in case of errors (fixes #93)
* (AlCalzone) Use @iobroker/testing for testing (fixes #89)
* (AlCalzone & foxriver76) Add issue templates for github (fixes #85)
* (ldittmar) Add Yandex translator to gulpfile.js (#84).  
To use it, append `--yandex <yandex_api_key>` to the gulp command.
* (AlCalzone) Add license to io-package.json (fixes #88)

## v1.8.0 (2019-01-24)
* (AlCalzone & jogibear9988) Add ES6 class support for the main file

## v1.7.0 (2019-01-23)
* (AlCalzone) Automatically create the template repo on release
* (AlCalzone) Always create `gulpfile.js`, even in VIS-only templates (fixes #75)
* (AlCalzone) Add `"compact": true` to `io-package.json` in adapter mode (fixes #47)

## v1.6.3 (2019-01-22)
* (AlCalzone) Use `files` in `package.json` instead of `.npmignore` to avoid excluding templates.

## v1.6.1 (2019-01-19)
* (AlCalzone) Fix "cannot find module `typescript`"

## v1.6.0 (2019-01-17)
* (AlCalzone) Allow choosing quote style in TypeScript (fixes #33)
* (AlCalzone) Ensure JS files contain `"use strict";` (fixes #53)
* (AlCalzone) Print the creator version in the main file header (fixes #52)
* (ldittmar) Add zh-cn (chinese) language
* (jogibear9988) Add translation to gulp
* (ldittmar) Improve README.md (#25)
* (AlCalzone) Allow editing static templates in separate files with the correct extension (#62)
* (ldittmar) Merge translations of VIS and admin, fix gulpfile template (#63)
* (ldittmar & AlCalzone) Support custom_m.html (fixes #61)
* (ldittmar & AlCalzone) Support admin tab (fixes #14)

## v1.5.0 (2019-01-07)
* (AlCalzone) Allow targeting newer ES version when using JS (fixes #43)
* (AlCalzone) Support compact mode (coming in JS-Controller 2.0) (fixes #47)

## v1.4.0 (2018-12-27)
* (AlCalzone) Add selection for adapter category (fixes #2)
* (AlCalzone) Move ESLint to non-dev dependencies (fixes #44)

## v1.3.0 (2018-12-20)
* (AlCalzone) Add a start mode selection (fixes #6)
* (AlCalzone) Avoid running into API rate limitations while testing (#40)
* (AlCalzone) Provide automatic translations for io-package fields (#39)
* (AlCalzone) Ask the user for a title (mandatory) and a short description (optional) (#37)

## v1.2.0 (2018-12-16)
* (AlCalzone) Initialize the git repo automatically (fixes #13)
* (AlCalzone) When using TypeScript, perform an initial build run (fixes #27)
* (AlCalzone) When formatting files, clear lines with only whitespace (fixes #30)
* (AlCalzone) Enable resolveJsonModule for JS files (fixes #26)
* (AlCalzone) Allow choosing quote style in JavaScript (#34)

## v1.1.0 (2018-12-14)
* (AlCalzone) Fix ESLint errors in test files
* (AlCalzone) Refactor file creation to make it usable independently from CLI (#23)
* (ldittmar81) Update icon (#28)
* (AlCalzone) Sort and cleanup dependencies, check package-lock.json into git
* (AlCalzone) Update `gulp` to v4 (#21) and fix ESLint errors in `gulpfile.js`
* (AlCalzone) Declare `systemDictionary` in the admin files (#19)
* (AlCalzone) Do not ignore all i18n intermediate files

## v1.0.2 (2018-12-04)
* (AlCalzone) Check adapter name more strictly (#11)
* (AlCalzone) Print adapter version on start (#10)
* (AlCalzone) Always delete npm-debug.log on exit

## v1.0.0 (2018-12-03)
* (AlCalzone) First public version with many features

## v0.0.1 (2018-12-01)
* (AlCalzone) Initial release
