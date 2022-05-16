# Remove deprecated unit tests

The adapter unit tests have been deprecated for quite a while. If you're not using custom unit tests, you can remove the test script from your adapter. To do so, delete the file `test/unit.js` and the following line from `package.json`:

```diff
-     "test:unit": "mocha test/unit --exit",
```
