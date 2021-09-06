# Use dependency caching in Github Actions

The `setup-node` action supports dependency caching in version 2, allowing you to speed up tests on Github Actions. To take advantage of this, edit your `.github/workflows/test-and-release.yml` as follows:

```diff
       - name: Use Node.js ${{ matrix.node-version }}
-        uses: actions/setup-node@v1
+        uses: actions/setup-node@v2
         with:
           node-version: ${{ matrix.node-version }}
+          cache: 'npm'
```

This change may need to be done in multiple locations.
