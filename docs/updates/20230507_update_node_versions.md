# Update `test-and-release.yml` node versions

As node 14 is EOL and node 20 is already available, the following changed should be applied to the test environment:

## `.github/workflows/test-and-release.yml`

```diff
     steps:
       - uses: ioBroker/testing-action-check@v1
         with:
-          node-version: '16.x'
+          node-version: '18.x'
           # Uncomment the following line if your adapter cannot be installed using 'npm ci'
           # install-command: 'npm install'
           lint: true
...
     runs-on: ${{ matrix.os }}
     strategy:
       matrix:
-        node-version: [14.x, 16.x, 18.x]
+        node-version: [16.x, 18.x, 20.x]
         os: [ubuntu-latest, windows-latest, macos-latest]

     steps:
...
 #    steps:
 #      - uses: ioBroker/testing-action-deploy@v1
 #        with:
-#          node-version: '16.x'
+#          node-version: '18.x'
 #          # Uncomment the following line if your adapter cannot be installed using 'npm ci'
 #          # install-command: 'npm install'
 #          npm-token: ${{ secrets.NPM_TOKEN }}
```
