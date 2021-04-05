# Update Dependabot auto-merge workflow to work with recent GitHub changes

GitHub recently changed the permissions for workflow triggered by Dependabot PRs: https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/

To handle these changes, edit the workflow file `.github/workflows/dependabot-auto-merge.yml` as follows:

```diff
on:
-  pull_request:
+  # WARNING: This needs to be run in the PR base, DO NOT build untrusted code in this action
+  # details under https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/
+  pull_request_target:

jobs:
  auto-merge:
+    if: github.actor == 'dependabot[bot]'
```
