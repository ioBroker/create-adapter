# Replace the deprecated `set-env` command in GitHub Actions workflow

GitHub has announced that `set-env` is [deprecated](https://github.blog/changelog/2020-10-01-github-actions-deprecating-set-env-and-add-path-commands/) for security reasons and will stop working in the future. We're using this command in the automatic release workflow. To update, change `.github/workflows/test-and-release.yml` as follows:

```diff
  run: |
    VERSION="${{ github.ref }}"
    VERSION=${VERSION##*/v}
-   echo "::set-env name=VERSION::$VERSION"
+   echo "VERSION=$VERSION" >> $GITHUB_ENV
    BODY=$(git show -s --format=%b)
    BODY="${BODY//'%'/'%25'}"
    BODY="${BODY//$'\n'/'%0A'}"
    BODY="${BODY//$'\r'/'%0D'}"
-   echo "::set-env name=BODY::$BODY"
+   echo "BODY=$BODY" >> $GITHUB_ENV
```
