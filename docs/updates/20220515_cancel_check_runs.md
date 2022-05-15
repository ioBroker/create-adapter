# Cancel previous PR/branch runs when a new commit is pushed

GitHub Actions allows canceling check runs when a new commit is pushed. This avoid wasting time on outdated commits and yields quicker results on the current one.

To make use of this, edit your `.github/workflows/test-and-release.yml` file as follows:

```diff
+ # Cancel previous PR/branch runs when a new commit is pushed
+ concurrency:
+   group: ${{ github.ref }}
+   cancel-in-progress: true

  jobs:
```
