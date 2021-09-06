import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	const useTypeScript = answers.language === "TypeScript";
	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;

	const latestNodeVersion = "14.x";
	const adapterTestVersions = ["12.x", "14.x", "16.x"];
	const adapterTestOS = ["ubuntu-latest", "windows-latest", "macos-latest"]

  const adapterName = answers.adapterName;

	const template = `
name: Test and Release

# Run this job on all pushes and pull requests
# as well as tags with a semantic version
on:
    push:
        branches:
            - "*"
        tags:
            # normal versions
            - "v[0-9]+.[0-9]+.[0-9]+"
            # pre-releases
            - "v[0-9]+.[0-9]+.[0-9]+-**"
    pull_request: {}

jobs:
    # Performs quick checks before the expensive test runs
    check-and-lint:
        if: contains(github.event.head_commit.message, '[skip ci]') == false

        runs-on: ubuntu-latest

        strategy:
            matrix:
                node-version: [${latestNodeVersion}]

        steps:
            - name: Checkout code
              uses: actions/checkout@v2

            - name: Use Node.js \${{ matrix.node-version }}
              uses: actions/setup-node@v2
              with:
                  node-version: \${{ matrix.node-version }}
                  cache: 'npm'

            - name: Install Dependencies
              run: npm ci
${useTypeScript ? (
`            - name: Perform a type check
              run: npm run build:ts -- --noEmit
              env:
                  CI: true`) : ""}
${useESLint ? (
`            - name: Lint source code
              run: npm run lint
`) : ""}            - name: Test package files
              run: npm run test:package

${isAdapter ? (
`    # Runs adapter tests on all supported node versions and OSes
    adapter-tests:
        if: contains(github.event.head_commit.message, '[skip ci]') == false

        needs: [check-and-lint]

        runs-on: \${{ matrix.os }}
        strategy:
            matrix:
                node-version: [${adapterTestVersions.join(", ")}]
                os: [${adapterTestOS.join(", ")}]
${(adapterTestOS.includes("windows-latest") && adapterTestVersions.includes("8.x")) ? (
	// This is unnecessary but I'm leaving it here in case we need it again.
	// The else branch will never trigger
`                exclude:
                    # Don't test Node.js 8 on Windows. npm is weird here
                    - os: windows-latest
                      node-version: 8.x`
) :""}
        steps:
            - name: Checkout code
              uses: actions/checkout@v2

            - name: Use Node.js \${{ matrix.node-version }}
              uses: actions/setup-node@v2
              with:
                  node-version: \${{ matrix.node-version }}
                  cache: 'npm'

            - name: Install Dependencies
              run: npm ci

            - name: Run unit tests
              run: npm run test:unit
${(adapterTestOS.includes("ubuntu-latest") || adapterTestOS.includes("macos-latest")) ? (`
            - name: Run integration tests (unix only)
              if: startsWith(runner.OS, 'windows') == false
              run: DEBUG=testing:* npm run test:integration`) :""}
${(adapterTestOS.includes("windows-latest")) ? (`
            - name: Run integration tests (windows only)
              if: startsWith(runner.OS, 'windows')
              run: set DEBUG=testing:* & npm run test:integration`) :""}
`) : ""}
# TODO: To enable automatic npm releases, create a token on npmjs.org 
# Enter this token as a GitHub secret (with name NPM_TOKEN) in the repository options
# Then uncomment the following block:

#    # Deploys the final package to NPM
#    deploy:
#        needs: [${isAdapter ? "adapter-tests" : "check-and-lint"}]
#
#        # Trigger this step only when a commit on any branch is tagged with a version number
#        if: |
#            contains(github.event.head_commit.message, '[skip ci]') == false &&
#            github.event_name == 'push' &&
#            startsWith(github.ref, 'refs/tags/v')
#
#        runs-on: ubuntu-latest
#        strategy:
#            matrix:
#                node-version: [${latestNodeVersion}]
#
#        steps:
#            - name: Checkout code
#              uses: actions/checkout@v2
#
#            - name: Use Node.js \${{ matrix.node-version }}
#              uses: actions/setup-node@v2
#              with:
#                  node-version: \${{ matrix.node-version }}
#                  cache: 'npm'
#
#            - name: Extract the version and commit body from the tag
#              id: extract_release
#              # The body may be multiline, therefore newlines and % need to be escaped
#              run: |
#                  VERSION="\${{ github.ref }}"
#                  VERSION=\${VERSION##*/v}
#                  echo "::set-output name=VERSION::$VERSION"
#                  BODY=$(git show -s --format=%b)
#                  BODY="\${BODY//'%'/'%25'}"
#                  BODY="\${BODY//$'\\n'/'%0A'}"
#                  BODY="\${BODY//$'\\r'/'%0D'}"
#                  echo "::set-output name=BODY::$BODY"
${useTypeScript ? (
`#
#            - name: Install Dependencies
#              run: npm ci
#            - name: Create a clean build
#              run: npm run build
`) : ""}#
#            - name: Publish package to npm
#              run: |
#                  npm config set //registry.npmjs.org/:_authToken=\${{ secrets.NPM_TOKEN }}
#                  npm whoami
#                  npm publish
#
#            - name: Create Github Release
#              uses: actions/create-release@v1
#              env:
#                  GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
#              with:
#                  tag_name: \${{ github.ref }}
#                  release_name: Release v\${{ steps.extract_release.outputs.VERSION }}
#                  draft: false
#                  # Prerelease versions create prereleases on Github
#                  prerelease: \${{ contains(steps.extract_release.outputs.VERSION, '-') }}
#                  body: \${{ steps.extract_release.outputs.BODY }}
#
#            # When using Sentry for error reporting, Sentry could be informed about new releases
#            # To enable create a API-Token in Sentry (User settings, API keys)
#            # Enter this token as a GitHub secret (with name SENTRY_AUTH_TOKEN) in the repository options
#            # Then uncomment and customize the following block:
#            #- name: Notify Sentry.io about the release
#            #  run: |
#            #      npm i -g @sentry/cli
#            #      export SENTRY_AUTH_TOKEN=\${{ secrets.SENTRY_AUTH_TOKEN }}
#            #      export SENTRY_URL=https://sentry.iobroker.net
#            #      export SENTRY_ORG=iobroker
#            #      export SENTRY_PROJECT=iobroker-${adapterName}
#            #      export SENTRY_VERSION=iobroker.${adapterName}@\${{ steps.extract_release.outputs.VERSION }}
#            #      sentry-cli releases new $SENTRY_VERSION
#            #      sentry-cli releases finalize $SENTRY_VERSION
#            #      # Add the following line BEFORE finalize if repositories are connected in Sentry
#            #      #sentry-cli releases set-commits $SENTRY_VERSION --auto
#            #      # Add the following line BEFORE finalize if sourcemap uploads are needed
#            #      #sentry-cli releases files $SENTRY_VERSION upload-sourcemaps build/
`;	return template.trimLeft();
};

templateFunction.customPath = ".github/workflows/test-and-release.yml";
// Reformatting this would create mixed tabs and spaces
templateFunction.noReformat = true;
export = templateFunction;
