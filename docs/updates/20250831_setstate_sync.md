# Replace deprecated setStateAsync with setState

The `setStateAsync` method has been deprecated in favor of the `setState` method. Newly created adapters will now use the current recommended API. If you have an existing adapter using `setStateAsync`, you should update it to use `setState` instead.

## What changed

The adapter template generation was updated to use `await this.setState()` instead of `await this.setStateAsync()` for setting states.

## Manual migration for existing adapters

If you have an existing adapter that uses `setStateAsync`, you should replace all occurrences with the `setState` method:

```diff
// Before (deprecated)
- await this.setStateAsync("testVariable", true);
- await this.setStateAsync("testVariable", { val: true, ack: true });
- await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

// After (current)
+ await this.setState("testVariable", true);
+ await this.setState("testVariable", { val: true, ack: true });
+ await this.setState("testVariable", { val: true, ack: true, expire: 30 });
```

## Why this change

The `setStateAsync` method was deprecated in favor of the simpler `setState` method:
- `setState` when called without a callback returns a Promise and should be awaited
- `setState` when called with a callback is synchronous
- Using `setState` aligns with current ioBroker adapter development best practices

## No functional changes

This change does not affect the functionality of your adapter - both methods perform the same operation. The only difference is using the current recommended API instead of the deprecated one.