# Remove fa-icon from admin tabs for Admin 5 compatibility

Admin 5 no longer supports custom icons for admin tabs. The `fa-icon` property should be removed from the `adminTab` configuration in your adapter's `io-package.json`.

## Update your adapter's io-package.json

If your adapter has an admin tab configuration with a `fa-icon` property, remove it:

```diff
  "adminTab": {
    "singleton": true,
    "name": {
      "en": "test-adapter",
      "de": "test-adapter"
    },
    "link": "",
-   "fa-icon": "info"
  }
```

## Why this change is needed

As referenced in the [ioBroker.admin issue comment](https://github.com/ioBroker/ioBroker.admin/issues/797#issuecomment-832727552), Admin 5 handles tab icons differently and adapters should no longer specify their own icons.

## What happens if you don't update

Your adapter will continue to work, but the `fa-icon` property will be ignored by Admin 5. Removing it ensures your adapter configuration is clean and follows current best practices.