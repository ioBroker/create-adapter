# Upgrade to @iobroker/testing 5.1.1 and remove redundant dependencies

@iobroker/testing version 5.1.1 now includes many test dependencies that were previously required to be manually added to adapter projects. This update allows you to clean up your `package.json` file by removing redundant dependencies.

## Update @iobroker/testing version

Update the @iobroker/testing version in your `package.json` devDependencies:

```diff
  "devDependencies": {
-   "@iobroker/testing": "^4.1.3",
+   "@iobroker/testing": "^5.1.1",
    // ... other dependencies
  },
```

## Remove redundant test dependencies

The following dependencies can now be removed from your `package.json` devDependencies since they are included in `@iobroker/testing` 5.1.1:

### Runtime test dependencies:
```diff
  "devDependencies": {
-   "chai": "^4.5.0",
-   "chai-as-promised": "^7.1.2",
-   "mocha": "^11.7.1",
-   "sinon": "^19.0.5",
-   "sinon-chai": "^3.7.0",
-   "proxyquire": "^2.1.3",
    // ... other dependencies
  },
```

### Type definitions:
```diff
  "devDependencies": {
-   "@types/chai": "^4.3.20",
-   "@types/chai-as-promised": "^8.0.2",
-   "@types/mocha": "^10.0.10",
-   "@types/sinon": "^17.0.4",
-   "@types/sinon-chai": "^3.2.12",
-   "@types/proxyquire": "^1.3.31",
    // ... other dependencies
  },
```

## Test script updates (optional)

If you want to include template creation testing in your main test suite (for consistency with CI), you can add a `test:templates` script to your `package.json`:

```diff
  "scripts": {
    "test": "npm run test:js && npm run test:integration",
+   "test:templates": "mocha test/testAdapterCreation.js --timeout 60000",
    // ... other scripts
  },
```

Then update your main test script to include it:

```diff
  "scripts": {
-   "test": "npm run test:js && npm run test:integration",
+   "test": "npm run test:js && npm run test:integration && npm run test:templates",
    // ... other scripts
  },
```

## After the changes

After making these changes:

1. Delete your `node_modules` folder and `package-lock.json` file
2. Run `npm install` to reinstall dependencies with the updated versions
3. Run `npm test` to verify everything still works correctly

All testing functionality remains unchanged as the dependencies are now provided by `@iobroker/testing` 5.1.1.