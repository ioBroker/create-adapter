import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isAdapter = answers.features?.includes("adapter");
	const useTypeScript = answers.language === "TypeScript";
	const useESLint = answers.tools?.includes("ESLint");
	const useReact = answers.adminUi === "react" || answers.tabReact === "yes";
	const needsBuild = useTypeScript || useReact;
	const sourcemapPaths = [
		...(useTypeScript ? ["build/"] : []),
		...(useReact ? ["admin/build/"] : []),
	];
	const useReleaseScript = answers.releaseScript === "yes";
	const isGitHub = answers.target === "github";

	const ltsNodeVersion = "18.x";
	const adapterTestVersions = ["18.x", "20.x"];
	const adapterTestOS = ["ubuntu-latest", "windows-latest", "macos-latest"];

	const adapterName = answers.adapterName;

	const deploy = useReleaseScript && isGitHub;
	const escapeDeploy = 
		deploy ?
			(input: string) => input :
			(input: string) => input.replace(/^/gm, '#');

	const template = `
name: Test and Release

# Run this job on all pushes and pull requests
# as well as tags with a semantic version
on:
  push:
    branches:
      - "${answers.defaultBranch ?? "main"}"
    tags:
      # normal versions
      - "v[0-9]+.[0-9]+.[0-9]+"
      # pre-releases
      - "v[0-9]+.[0-9]+.[0-9]+-**"
  pull_request: {}

# Cancel previous PR/branch runs when a new commit is pushed
concurrency:
  group: \${{ github.ref }}
  cancel-in-progress: true

jobs:
  # Performs quick checks before the expensive test runs
  check-and-lint:
    if: contains(github.event.head_commit.message, '[skip ci]') == false

    runs-on: ubuntu-latest

    steps:
      - uses: ioBroker/testing-action-check@v1
        with:
          node-version: '${ltsNodeVersion}'
          # Uncomment the following line if your adapter cannot be installed using 'npm ci'
          # install-command: 'npm install'${useTypeScript ? (`
          type-checking: true`) : ""}${useESLint ? (`
          lint: true`) : ""}

${isAdapter ? (
`  # Runs adapter tests on all supported node versions and OSes
  adapter-tests:
    if: contains(github.event.head_commit.message, '[skip ci]') == false

    runs-on: \${{ matrix.os }}
    strategy:
      matrix:
        node-version: [${adapterTestVersions.join(", ")}]
        os: [${adapterTestOS.join(", ")}]

    steps:
      - uses: ioBroker/testing-action-adapter@v1
        with:
          node-version: \${{ matrix.node-version }}
          os: \${{ matrix.os }}
          # Uncomment the following line if your adapter cannot be installed using 'npm ci'
          # install-command: 'npm install'${needsBuild ? (`
          build: true`) : ""}
`) : ""}${deploy ? "" : (`
# TODO: To enable automatic npm releases, create a token on npmjs.org 
# Enter this token as a GitHub secret (with name NPM_TOKEN) in the repository options
# Then uncomment the following block:
`)}
${escapeDeploy(
`  # Deploys the final package to NPM
  deploy:
    needs: [check-and-lint${isAdapter ? ", adapter-tests" : ""}]

    # Trigger this step only when a commit on any branch is tagged with a version number
    if: |
      contains(github.event.head_commit.message, '[skip ci]') == false &&
      github.event_name == 'push' &&
      startsWith(github.ref, 'refs/tags/v')

    runs-on: ubuntu-latest

    # Write permissions are required to create Github releases
    permissions:
      contents: write

    steps:
      - uses: ioBroker/testing-action-deploy@v1
        with:
          node-version: '${ltsNodeVersion}'
          # Uncomment the following line if your adapter cannot be installed using 'npm ci'
          # install-command: 'npm install'${needsBuild ? (`
          build: true`) : ""}
          npm-token: \${{ secrets.NPM_TOKEN }}
          github-token: \${{ secrets.GITHUB_TOKEN }}

          # When using Sentry for error reporting, Sentry can be informed about new releases
          # To enable create a API-Token in Sentry (User settings, API keys)
          # Enter this token as a GitHub secret (with name SENTRY_AUTH_TOKEN) in the repository options
          # Then uncomment and customize the following block:
          sentry: true
          sentry-token: \${{ secrets.SENTRY_AUTH_TOKEN }}
          sentry-project: "iobroker-${adapterName}"
          sentry-version-prefix: "iobroker.${adapterName}"${needsBuild ? (`
          sentry-sourcemap-paths: "${sourcemapPaths.join(" ")}"`) : ""}
          # If your sentry project is linked to a GitHub repository, you can enable the following option
          # sentry-github-integration: true`)}
`;
	return template.trimLeft();
};

templateFunction.customPath = ".github/workflows/test-and-release.yml";
// Reformatting this would create mixed tabs and spaces
templateFunction.noReformat = true;
export = templateFunction;
