# Changelog

<!--
	Placeholder for the next version:
	## __WORK IN PROGRESS__
	(at the beginning of a new line )
-->
## __WORK IN PROGRESS__
* (UncleSamSwiss) React Admin UI now uses @iobroker/adapter-react (#347) · [Migration guide](docs/updates/20201015_adapter_react.md)
* (AlCalzone) Add support for JavaScript+React in the Admin UI (#609)
* (AlCalzone) Make ts-node respect the "include" key in tsconfig.json (#603)
* (UncleSamSwiss) Fixed issue with running parcel in Devcontainer (with WSL2 remote path)
* (UncleSamSwiss) Cleaned up `.npmignore` file (#608)
* (AlCalzone) The GitHub Actions release workflow now longer uses the [deprecated `set-env`](https://github.blog/changelog/2020-10-01-github-actions-deprecating-set-env-and-add-path-commands/) command (#611) · [Migration guide](docs/updates/20201029_gh_actions_setenv.md)
* (AlCalzone) Lint and typecheck generated templates during CI testing (#610)
* (Peter Müller) Fixed CSS React UI height in Firefox · [Migration guide](docs/updates/20201103_css_fix.md)

## 1.29.1 (2020-09-28)
* (UncleSamSwiss) Remove rsync from parcel devcontainer (#589) · [Migration guide](docs/updates/20200924_devcontainer_parcel.md)
* (AlCalzone) Fix TypeError resulting from CI answer change (fixes #590)

## 1.29.0 (2020-09-22)
* (AlCalzone) Add Badge for Github Actions to Readme (#585)
* (AlCalzone) Select GitHub Actions as the default CI (fixes #586)
* (AlCalzone) Updated JS-Controller dependency to `>=2.0.0` for compatibility with `@iobroker/adapter-core` `v2.4.0`.

## 1.28.0 (2020-09-11)
* (UncleSamSwiss) Improved command line arguments handling (#573)
* (UncleSamSwiss) Allow to replay the adapter creation with the same answers (#574)
* (UncleSamSwiss) Removed automatic restart of docker containers (#575) · [Migration guide](docs/updates/20200909_devcontainers_no_restart.md)
* (AlCalzone) Make ESLint work in the admin directory, fix most resulting errors (fixes #576)
* (AlCalzone) The year and name placeholders in the Apache License are now correctly replaced (fixes #578)
* (AlCalzone) Added dependabot config for automated dependency updates with auto-merging (#582) · [Migration guide](docs/updates/20200910_dependabot.md)
* (AlCalzone) Fixed how mocha interacts with TypeScript (#583)

## 1.27.0 (2020-09-06)
* (AlCalzone) Add support for TypeScript+React in the Admin UI · [Migration guide](docs/updates/20200902_typescript_react_admin.md)
* (AlCalzone) Update definitions for type checking in the Admin UI, add some layout fixes to CSS · [Migration guide](docs/updates/20200902_admin_ui_updates.md)
* (AlCalzone & UncleSamSwiss) Added support for VSCode devcontainers · [Migration guide](docs/updates/20200902_vscode_devcontainers.md)
* (AlCalzone) The creator now uses Github Actions for testing and releases

## 1.26.3 (2020-08-26)
* (AlCalzone) Update release-script and ESLint
* (AlCalzone) Enable "no-trailing-spaces" ESLint rule in adapters (fixes #549)

## 1.26.2 (2020-08-18)
* (AlCalzone) Convert `mocha.opts` to `.mocharc.json` (supports mocha 8) (fixes #547)

## 1.26.1 (2020-08-17)
* (AlCalzone) Fixed ESLint errors in the generated `src/lib/tools.ts` (fixes #545)
* (AlCalzone) Fixed ESLint errors in the creator sources

## 1.26.0 (2020-06-22)
* (AlCalzone) The auto-deploy now also creates Github Releases
* (AlCalzone) Modernized the main file templates with some best practices and async methods

## 1.25.0 (2020-05-31)
* (klein0r) Fix translations in VIS projects (#503)
* (AlCalzone) Update the CI scripts (including Node.js 14.x)
* (AlCalzone) Print better error message when translations hit the rate limiter
* (AlCalzone) Synchronize translation implementation in TS with the JS one

## 1.24.2 (2020-04-27)
* (AlCalzone) Fixed compatibility with `@types/iobroker@3.0.6`

## 1.24.1 (2020-04-21)
* (AlCalzone) Move `@typescript-eslint/parser` to dependencies to fix crash when building TypeScript adapters.

## 1.24.0 (2020-04-19)
* (Mic-M) Don't auto-translate empty texts (fixes #462)
* (AlCalzone) Drop Node.js 8 from testing

## 1.23.0 (2020-03-17)
* (AlCalzone) Update `.travis.yml` in the template to `gcc 6`
* (oweitman) Remember bound handler in VIS template to avoid leak (fixes https://github.com/ioBroker/ioBroker.template/issues/62)
* (AlCalzone) Use bracket property access in VIS widget to avoid runtime errors when the widget name contains a `-`
* (AlCalzone) Pin the `sinon` dependency on `8.x` until we drop Node.js 8 support (fixes #436)

## 1.22.0 (2020-03-02)
* (AlCalzone) Bump Node.js typings in generated adapters (`@types/node`) to 12.x
* (AlCalzone) Add link to best practices in the generated adapter README (fixes #417)
* (AlCalzone) Re-enable Travis CI as the default CI in adapters

## 1.21.1 (2020-02-03)
* (AlCalzone) Add `tsconfig.json` to `.npmignore` if type-checking is enabled (fixes #395)

## 1.21.0 (2020-01-26)
* (AlCalzone) Add support for connectionType and dataSource (fixes #386)

## 1.20.1 (2020-01-25)
* (AlCalzone) Add the `vehicle` adapter type (fixes #384)
* (AlCalzone) The auto-publish on Github Actions now also works for pre-releases, e.g. `v1.0.0-beta.2` (#387)

## 1.20.0 (2020-01-16)
* (AlCalzone) Add the possibility to start `schedule` adapters when the configuration changes (fixes #376)

## v1.19.0 (2019-12-30)
* (AlCalzone) It is now possible to use Github Actions and Travis together

## v1.18.0 (2019-11-26)
* (AlCalzone) Add badges for number of installations (fixes #311)
* (AlCalzone) Add Github Actions as the default CI choice (#341)
* (AlCalzone) Mention automatic release process in the template readme (#342)

## v1.17.0 (2019-10-13)
* (AlCalzone) The package files are now CI tested for VIS projects (fixes #302)
* (AlCalzone) Add the possibility to specify contributors (fixes #304)
* (AlCalzone) Add *.code-workspace to git and npm ignore (fixes #309)

## v1.16.0 (2019-07-12)
* (bluefox & AlCalzone) Add email address to MIT license (#232)

## v1.15.1 (2019-06-07)
* (AlCalzone) Properly fix build breaks from #193.  
The original "fix" broke the creator instead

## v1.15.0 (2019-06-07)
* (AlCalzone) Allow choosing the git remote protocol (HTTPS or SSH) (fixes #180)
* (AlCalzone) Add expert mode. In non-expert mode, some questions are not asked (fixes #183)
* (AlCalzone) Remove admin dependency, which prevents installation on a slave host (#199)

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
