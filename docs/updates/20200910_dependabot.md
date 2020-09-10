# GitHub-native Dependabot for automated dependency updates (#582)

GitHub now includes Dependabot for automated dependency and security updates. You can read more here: https://github.blog/2020-06-01-keep-all-your-packages-up-to-date-with-dependabot/. Unfortunately it does no longer have the ability to automatically merge certain updates, but we got you covered.

Migration guide:

1. Create a `.github/dependabot.yml` with the following content and replace `YOUR_NAME_HERE` with your GitHub account name:
```yml
version: 2
updates:
- package-ecosystem: npm
  directory: "/"
  schedule:
    interval: monthly
    time: "04:00"
    timezone: Europe/Berlin
  open-pull-requests-limit: 20
  assignees:
  - YOUR_NAME_HERE
  versioning-strategy: increase
```

2. Create a `.github/auto-merge.yml` with the following content:
```yml
# Configure here which dependency updates should be merged automatically.
# The recommended configuration is the following:
- match:
    # Only merge patches for production dependencies
    dependency_type: production
    update_type: "semver:patch"
- match:
    # Except for security fixes, here we allow minor patches
    dependency_type: production
    update_type: "security:minor"
- match:
    # and development dependencies can have a minor update, too
    dependency_type: development
    update_type: "semver:minor"

# The syntax is based on the legacy dependabot v1 automerged_updates syntax, see:
# https://dependabot.com/docs/config-file/#automerged_updates
```

3. Create a `.github/workflows/dependabot-auto-merge.yml` with the following content:
```yml
# Automatically merge Dependabot PRs when version comparison is within the range
# that is configured in .github/auto-merge.yml

name: Auto-Merge Dependabot PRs

on:
  pull_request:

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Check if PR should be auto-merged
        uses: ahmadnassri/action-dependabot-auto-merge@v2
        with:
          # This must be a personal access token with push access
          github-token: ${{ secrets.AUTO_MERGE_TOKEN }}
          # By default, squash and merge, so Github chooses nice commit messages
          command: squash and merge
```

4. Add a new secret in your repo configuration with the name \`AUTO_MERGE_TOKEN\`. It must contain a personal access token with push access to the repository. You can create a new token under https://github.com/settings/tokens.
