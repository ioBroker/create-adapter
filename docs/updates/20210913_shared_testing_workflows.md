# Shared testing workflows

Github recently added support for [composite actions](https://github.blog/changelog/2021-08-25-github-actions-reduce-duplication-with-action-composition/) which finally allow us to provide shared testing workflows:

-   https://github.com/ioBroker/testing-action-check - Package file checks, linting, type checking
-   https://github.com/ioBroker/testing-action-adapter - Adapter integration tests
-   https://github.com/ioBroker/testing-action-deploy - Automatic deploy to npm, Github Releases and Sentry

This leads to a greatly simplified testing workflow file. To migrate, we recommend:  
a) creating a new adapter directory with the creator and copying `.github/workflows/test-and-release.yml` to your adapter directory  
**- or -**  
b) using the replay function to shorten this process:

```
npx @iobroker/create-adapter --target=/somewhere/else --replay=/your/adapter/.create-adapter.json
```

---

Here's an example for a **TypeScript** adapter:

<!-- prettier-ignore -->
```yml
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

    steps:
      - uses: ioBroker/testing-action-check@v1
        with:
          node-version: '14.x'
          # Uncomment the following line if your adapter cannot be installed using 'npm ci'
          # install-command: 'npm install'
          type-checking: true
          lint: true

  # Runs adapter tests on all supported node versions and OSes
  adapter-tests:
    if: contains(github.event.head_commit.message, '[skip ci]') == false

    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]
        os: [ubuntu-latest, windows-latest, macos-latest]

    steps:
      - uses: ioBroker/testing-action-adapter@v1
        with:
          node-version: ${{ matrix.node-version }}
          os: ${{ matrix.os }}
          # Uncomment the following line if your adapter cannot be installed using 'npm ci'
          # install-command: 'npm install'
          build: true

# TODO: To enable automatic npm releases, create a token on npmjs.org 
# Enter this token as a GitHub secret (with name NPM_TOKEN) in the repository options
# Then uncomment the following block:

#  # Deploys the final package to NPM
#  deploy:
#    needs: [check-and-lint, adapter-tests]
#
#    # Trigger this step only when a commit on any branch is tagged with a version number
#    if: |
#      contains(github.event.head_commit.message, '[skip ci]') == false &&
#      github.event_name == 'push' &&
#      startsWith(github.ref, 'refs/tags/v')
#
#    runs-on: ubuntu-latest
#
#    steps:
#      - uses: ioBroker/testing-action-deploy@v1
#        with:
#          node-version: '14.x'
#          # Uncomment the following line if your adapter cannot be installed using 'npm ci'
#          # install-command: 'npm install'
#          build: true
#          npm-token: ${{ secrets.NPM_TOKEN }}
#          github-token: ${{ secrets.GITHUB_TOKEN }}
#
#          # When using Sentry for error reporting, Sentry can be informed about new releases
#          # To enable create a API-Token in Sentry (User settings, API keys)
#          # Enter this token as a GitHub secret (with name SENTRY_AUTH_TOKEN) in the repository options
#          # Then uncomment and customize the following block:
#          sentry-token: ${{ secrets.SENTRY_AUTH_TOKEN }}
#          sentry-project: "iobroker-test-adapter"
#          sentry-version-prefix: "iobroker.test-adapter"
#          sentry-sourcemap-paths: "build/ admin/build/"
#          # If your sentry project is linked to a GitHub repository, you can enable the following option
#          # sentry-github-integration: true
```
