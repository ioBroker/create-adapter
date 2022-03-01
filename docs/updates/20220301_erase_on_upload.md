# Set `eraseOnUpload` to `true` for React adapters

Since `@iobroker/adapter-dev` version 1.1.0 the output from `npm run build` might be split into multiple output files with random names.

As `ioBroker.js-controller` with versions below 4.1 will not erase old files on upload, new adapter versions might upload more and more files to the `admin` directory.

Therefore, you should explicitly set `common.eraseOnUpload` in `io-package.json` to `true` for React adapters.

```diff
 {
     "common": {
         // other properties ...
         "connectionType": "local",
         "dataSource": "push",
         "materialize": true,
+        "eraseOnUpload": true,
         "dependencies": [
             {
                 "js-controller": ">=2.0.0"
```

See also https://github.com/ioBroker/adapter-dev/pull/116 for more details.
