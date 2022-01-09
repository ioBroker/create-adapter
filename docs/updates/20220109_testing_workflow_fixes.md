# Fixed a syntax error in the test-and-release workflow

The workflow file `.github/workflows/test-and-release.yml` had a syntax error, preventing it to run for `pull_request` triggers.
Because the fix will cause duplicate builds in branches (one for `push` and one for `pull_request`), the workflow file has been updated to only run for pull requests and pushes to the default branch.

To update your file, do the following changes (you might need to replace `main` with the name of your default branch):

```diff
name: Test and Release

# Run this job on all pushes and pull requests
# as well as tags with a semantic version
on:
  push:
    branches:
-      - "*"
+      - "main"
    tags:
      # normal versions
      - "v[0-9]+.[0-9]+.[0-9]+"
      # pre-releases
      - "v[0-9]+.[0-9]+.[0-9]+-**"
-    pull_request: {}
+  pull_request: {}
```

(There were two spaces too many before `pull_request`)
