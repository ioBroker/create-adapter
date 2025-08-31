# Replace deprecated setStateAsync with setState

The `setStateAsync` method has been deprecated in favor of the synchronous `setState` method. Newly created adapters will now use the current recommended API. If you have an existing adapter using `setStateAsync`, you should update it to use `setState` instead.

## What changed

The adapter template generation was updated to use `this.setState()` instead of `await this.setStateAsync()` for setting states.

## Manual migration for existing adapters

If you have an existing adapter that uses `setStateAsync`, you should replace all occurrences with the synchronous `setState` method:

```diff
// Before (deprecated)
- await this.setStateAsync("testVariable", true);
- await this.setStateAsync("testVariable", { val: true, ack: true });
- await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

// After (current)
+ this.setState("testVariable", true);
+ this.setState("testVariable", { val: true, ack: true });
+ this.setState("testVariable", { val: true, ack: true, expire: 30 });
```

## Why this change

The `setStateAsync` method was deprecated because:
- `setState` is now synchronous and doesn't return a Promise
- Using the synchronous version is simpler and more efficient
- It aligns with current ioBroker adapter development best practices

## No functional changes

This change does not affect the functionality of your adapter - both methods perform the same operation. The only difference is that `setState` is synchronous and doesn't need to be awaited.