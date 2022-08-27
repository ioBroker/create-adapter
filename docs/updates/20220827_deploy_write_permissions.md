# Require write permissions for `deploy` job

A while ago, GitHub changed the default permissions of the `GITHUB_TOKEN` to no longer be able to create releases by default.
If you've enabled automatic releases and they are failing due to missing permissions, you need to edit `.github/workflows/test-and-release.yml` to prevent them from failing.

Make sure to do this change inside the `deploy` job:

```diff
   # Deploys the final package to NPM
   deploy:
     needs: [check-and-lint, adapter-tests]

     # Trigger this step only when a commit on any branch is tagged with a version number
     if: |
       contains(github.event.head_commit.message, '[skip ci]') == false &&
       github.event_name == 'push' &&
       startsWith(github.ref, 'refs/tags/v')

     runs-on: ubuntu-latest
+
+    # Write permissions are required to create Github releases
+    permissions:
+      contents: write
```
