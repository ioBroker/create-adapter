# Changelog

<!--
	Placeholder for the next version:
	## __WORK IN PROGRESS__
	(at the beginning of a new line)
-->
## __WORK IN PROGRESS__
* (@Apollon77/@copilot) Add responsive size attributes to jsonConfig template (#1121) · [Migration guide](docs/updates/20250831_jsonconfig_responsive_attributes.md)
* (@hacki11) Dev Container improvements (#1137) · [Migration guide](docs/updates/20250404_devcontainer_improvments.md)
* (@hacki11) Allow newer versions of `admin` (#1137) · [Migration guide](docs/updates/20250406_admin_dependency_ge.md)
* (@Apollon77/@copilot) Upgrade to @iobroker/testing 5.1.1, remove redundant dependencies (#1165) · [Migration guide](docs/updates/20250831_iobroker_testing_51.md)
* (@Apollon77/@copilot) Update TypeScript to 5.9.2 and typescript-eslint to 7.x for both creator and generated templates (#1158) · [Migration guide](docs/updates/20250831_typescript_59_update.md)
* (@Apollon77/@copilot) Add Node.js 24 as a supported version (#1145) · [Migration guide](docs/updates/20250831_node24_support.md)
* (@Apollon77/@copilot) Replace deprecated `setStateAsync` with `setState` in adapter templates (#1148, [Migration guide](./docs/updates/20250831_setstate_sync.md))
* (@Apollon77/@copilot) Remove Node.js 18 as a supported version (#1154) · [Migration guide](docs/updates/20250831_remove_nodejs18_support.md)
* (@Apollon77/@copilot) Adjust the io-package schema location (#1153) · [Migration guide](docs/updates/20250831_jsonconfig_schema_url_fix.md)

## 2.6.5 (2024-09-13)
* (AlCalzone) Update required versions of `js-controller` and `admin` to the current stable versions (#1116)
* (AlCalzone) Remove deprecated `main` and `title` fields from `io-package.json` (#1115)
* (AlCalzone) Remove deprecated license field from `io-package.json` (#1114)
* (AlCalzone) Add Node.js 22 as a supported version, set 20 as the default choice (#1112)
* (AlCalzone) Update CI workflows for the adapter creator (#1111)

## 2.6.4 (2024-09-13)
* (AlCalzone) Pin several dependencies to older versions (#1110)

## 2.6.3 (2024-04-08)
* (AlCalzone) Pin `eslint` to version 8 (#1100)

## 2.6.2 (2024-02-12)
* (theknut) Make ioBroker types available in the test directory (#1091)
* (theknut) Add `licenseInformation` field to `io-package.json` (#1092)
* (AlCalzone) Remove the `subscribe` start mode (#1093)
* (AlCalzone) Remove the legacy way of creating adapters without classes (#1094)

## 2.6.1 (2024-01-15)
* (AlCalzone) Fixed an issue with TypeScript tests caused by #1082 (fixes #1084)

## 2.6.0 (2024-01-05)
* (AlCalzone) Change supported Node.js versions to 18 / 20 (#1082) · [Migration guide](docs/updates/20240105_min_node18.md)
* (AlCalzone) Simplify maintenance of ESLint config by using the `"latest"` parser version (#1082) · [Migration guide](docs/updates/20240105_ecmaversion_latest.md)
* (AlCalzone) Pin `chai` dependency to version 4 (#1082)

## 2.5.0 (2023-07-06)
* (mcm1957) Add `admin/words.js` to `.eslintignore` · [Migration guide](docs/updates/20230507_eslintignore_words_js.md)
* (mcm1957) Change supported Node.js versions to 16 / 18 / 20 (#1032) · [Migration guide](docs/updates/20230507_update_node_versions.md)

## 2.4.0 (2023-04-14)
* (xXBJXx) Ukranian translation has been added [Migration guide](docs/updates/20221202_add_uk_translation.md)
* (jpawlowski) Fix: JSON schema reference for `io-package.json` has been updated · [Migration guide](docs/updates/20221208_update_io-packages_json_schema_ref.md)
* (McM57) Fix: include json5 files from admin directory in npm package (#1029)

## 2.3.0 (2022-09-25)
* (mcm1957) Fix: use `adapter.` instead of `this.` in `main.js` in legacy mode (#972)
* (AlCalzone) Enable Dependabot by default, update Node.js version references (#977) · [Migration guide](docs/updates/20220925_update_node_version.md)
* (AlCalzone) Update the release script to version 3 (#978) · [Migration guide](docs/updates/20220925_releasescript_v3.md)

## 2.2.1 (2022-09-08)
* (AlCalzone) Fix `lint` command for JS adapters · [Migration guide](docs/updates/20220908_fix_lint_command.md)
* (Apollon77 & AlCalzone) Add disclaimer about use of names and logos to README (#957)

## 2.2.0 (2022-08-27)
* (AlCalzone) Test Node 18, drop Node 12 from testing (#909)
* (AlCalzone) Remove deprecated unit tests (#908) · [Migration guide](docs/updates/20220506_remove_unit_tests.md)
* (AlCalzone) Base `tsconfig.json` on `@tsconfig/node` packages (#910) · [Migration guide](docs/updates/20220506_tsconfig_node.md)
* (AlCalzone) Upgrade TypeScript dependency in adapters to `4.6` (#914)
* (AlCalzone) Cancel previous PR/branch runs when a new commit is pushed (#915) · [Migration guide](docs/updates/20220515_cancel_check_runs.md)
* (UncleSamSwiss) Add support for JSON Config UI (#724)
* (crycode-de) Fix `npm run check` for TS-React adapters · [Migration guide](docs/updates/20220608_check_ts_react.md)
* (AlCalzone) Replace ESM-only dependencies (#943)
* (Steiger04 & AlCalzone) Fix reactivity in VIS widget (#848)
* (AlCalzone) Fix: Offer `Prettier` for JS adapters too (#945)
* (AlCalzone) Remove non-functioning david-dm badge from README (#946)
* (klein0r & AlCalzone) Add GitHub Actions to Dependabot config, reduce pull request limit (#948) · [Migration guide](docs/updates/20220824_dependabot_gh_actions.md)
* (AlCalzone & klein0r) Enable syntax help for JSON Config in VSCode (#959) · [Migration guide](docs/updates/20220827_jsonconfig_vscode.md)
* (AlCalzone & klein0r) Fix `tsconfig.json` generation in `admin` directory (#960)
* (AlCalzone & klein0r) Fix automatic releases by requesting write permissions in `deploy` workflow (#961) · [Migration guide](docs/updates/20220827_deploy_write_permissions.md)
* (AlCalzone) Prevent widgets from overwriting VIS link by removing `localLinks` from `io-package.json` (#962)
* (AlCalzone) Append `.git` to HTTPS repository URLs (#963)
* (AlCalzone) Upgrade creator to TypeScript 4.8 (#964)

## 2.1.1 (2022-04-01)
* (UncleSamSwiss) Setting `eraseOnUpload` to `true` for React adapters (#886) · [Migration guide](docs/updates/20220301_erase_on_upload.md)
* (AlCalzone) Pinned `react`, `react-dom`, `@types/react` and `@types/react-dom` dependencies to v17, updated `@iobroker/adapter-react` to latest version (#896)
* Updated the creator's dependencies

## 2.1.0 (2022-02-16)
* (UncleSamSwiss) Switched from `gulp` to `@iobroker/adapter-dev` (#839) · [Migration guide](docs/updates/20211018_adapter-dev.md)
* (AlCalzone) Switch build process (React, TypeScript) from `parcel` to `@iobroker/adapter-dev` using `esbuild` (#838) · [Migration guide](docs/updates/20220215_esbuild.md)
* (AlCalzone) Updated the creator's dependencies (#877)
* (AlCalzone) Suppress npm messages for deprecated packages, audit and funding (#878)
* (AlCalzone) Add link to generated adapter in console output (#879)
* (AlCalzone) Update pinned adapter dependencies (#880)

## 2.0.2 (2022-01-10)
* (UncleSamSwiss) Updated axios to version 0.23.0 including generated typescript code (#833) · [Migration guide](docs/updates/20211013_axios_0_23.md)
* (AlCalzone) Add missing `sentry: true` to deploy workflow template (#849)
* (AlCalzone) Fixed a syntax error in the testing workflow file (#861) · [Migration guide](docs/updates/20220109_testing_workflow_fixes.md)

## 2.0.1 (2021-09-15)
* (UncleSamSwiss) Release script is currently fixed to version 2 as we don't support the new command line format yet (#823)
* (UncleSamSwiss) Fixed test-and-release workflow for TypeScript (#823)
* (UncleSamSwiss) Updated adapter-react to 2.0.13 (#823)

## 2.0.0 (2021-09-15)
* (AlCalzone) Require Node.js 12+ to execute the creator (#767)
* (AlCalzone) Add `common.title` property back into `io-package.json` (#796)
* (AlCalzone) Drop support for Travis CI (#797) · [Migration guide](docs/updates/20210818_no_travis.md)
* (AlCalzone) Use dependency caching on Github Actions (#809) · [Migration guide](docs/updates/20210902_github_dependency_caching.md)
* (AlCalzone) Restore compatibility with TypeScript 4.4+ (#808) · [Migration guide](docs/updates/20210902_typescript_44.md)
* (AlCalzone) Fix ESLint auto-formatting to generate correct quotes in React (#812)
* (AlCalzone) Allow exitCode 11 by default for schedule adapters during testing (#811)
* (AlCalzone) Updated `.gitignore`, added `.eslintignore` file (#813) · [Migration guide](docs/updates/20210906_ignore-files.md)
* (AlCalzone) Remove `.npmignore` blacklist, use `files` whitelist in `package.json` instead (#816) · [Migration guide](docs/updates/20210906_files_whitelist.md)
* (UncleSamSwiss) Updated alt texts of ioBroker badges in readme (#722)
* (AlCalzone) Shared testing workflows (#822) · [Migration guide](docs/updates/20210913_shared_testing_workflows.md)
* (UncleSamSwiss) Readme for adapter created using portal reflects the fact that the repository already exists (#788)
* (UncleSamSwiss) The default branch can now be chosen, default is "main", but it is possible to change to "master" (#631)

## 1.34.1 (2021-07-07)
* (UncleSamSwiss) Fix missing `common.main` in `io-package.json` (#778)

## 1.34.0 (2021-05-19)
* (UncleSamSwiss) Add support for Google Translate V3 API (requires credentials) (#720)
* (AlCalzone) Fix linter warnings in the creator codebase (#731)
* (AlCalzone & Dependabot) Updated dependencies
* (AlCalzone) Use official Docker image for devcontainer (#739) · [Migration guide](docs/updates/20210503_devcontainer_official_docker.md)
* (AlCalzone) Enable JSON schema support for io-package.json in VSCode (#740) · [Migration guide](docs/updates/20210503_vscode_io-package_schema.md)
* (AlCalzone) Improve documentation for the Dependabot auto-merge token (#743)
* (UncleSamSwiss) Fixed adapter-react dependencies by using `@iobroker/adapter-react` version 1.6.15 (#747) · [Migration guide](docs/updates/20210510_adapter-react-fix.md)
* (AlCalzone) Avoid generating mixed tabs and spaces in `.yml` files (#748)
* (AlCalzone) The template index no longer changes order when switching between Linux and Windows (#753)
* (AlCalzone) Enable TypeScript sourcemaps (#755) · [Migration guide](docs/updates/20210515_sourcemaps.md)
* (AlCalzone) Add Node 16 to test suite, drop Node 10 (#756) · [Migration guide](docs/updates/20210515_test_node_16.md)
* (UncleSamSwiss) Add option for release script (#759) · [Migration guide](docs/updates/20210519_release_script.md)
* (UncleSamSwiss) Add option for dev-server (#760) · [Migration guide](docs/updates/20210519_dev_server.md)

## 1.33.0 (2021-04-05)
* (AlCalzone) The generated `io-package.json` files are now validated with the official JSON schema during tests (#711)
* (UncleSamSwiss) Source code refactoring for web based create-adapter application (#716)
* (AlCalzone) Update Dependabot auto-merge workflow to work with recent GitHub changes (#719) · [Migration guide](docs/updates/20210405_automerge_fixes.md)

## 1.32.0 (2021-03-09)
* (AlCalzone) Update Readme: remove snyk.io badge, use https (#655)
* (Gaudes) Add Sentry notification about new release to workflow (#690)
* (Gaudes) Fix function declaration for translate function `_` (#691)
* (UncleSamSwiss) Add support for tab in Admin to use React (#674)
* (AlCalzone) Restore compatibility with `eslint-config-prettier` v8 (#709) · [Migration guide](docs/updates/20210301_prettier_config.md)
* (AlCalzone) Replaced the now deprecated compact mode check using `module.parent` with one that uses `require.main` (#653) · [Migration guide](docs/updates/20201201_require_main.md)
* (UncleSamSwiss) Add support for migrating an existing adapter project and pre-fill the answers (#712)

## 1.31.0 (2020-11-29)
* (crycode-de) Added better types for the `I18n.t` function based on words in `i18n/en.json` for TypeScript React UI (#630) · [Migration guide](docs/updates/20201107_typed_i18n_t.md)
* (AlCalzone) An adapter with devcontainer but without React no longer contains files for parcel (#635) · **Migration guide:** Delete `.devcontainer/parcel` directory.
* (UncleSamSwiss) Add support for number input settings in `index_m.html` (#634)
* (UncleSamSwiss) Fixing wrong comment about message box: to get `message` events, you need to set `common.messagebox` to true. (#638)

## 1.30.1 (2020-11-09)
* (AlCalzone) Fixed compatibility with `@iobroker/adapter-react@1.4.5` (#629) · [Migration guide](docs/updates/20201105_adapter_react_fixes.md)

## 1.30.0 (2020-11-03)
* (UncleSamSwiss) React Admin UI now uses `@iobroker/adapter-react` (#347) · [Migration guide](docs/updates/20201015_adapter_react.md)
* (AlCalzone) Add support for JavaScript+React in the Admin UI (#609)
* (AlCalzone) Make ts-node respect the "include" key in tsconfig.json (#603)
* (UncleSamSwiss) Fixed issue with running parcel in Devcontainer (with WSL2 remote path)
* (UncleSamSwiss) Cleaned up `.npmignore` file (#608)
* (AlCalzone) The GitHub Actions release workflow no longer uses the [deprecated `set-env`](https://github.blog/changelog/2020-10-01-github-actions-deprecating-set-env-and-add-path-commands/) command (#611) · [Migration guide](docs/updates/20201029_gh_actions_setenv.md)
* (AlCalzone) Lint and typecheck generated templates during CI testing (#610)
* (crycode-de) Fixed CSS React UI height in Firefox · [Migration guide](docs/updates/20201103_css_fix.md)

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
