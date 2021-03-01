# Use `require.main` to test if an adapter was started in compact mode

The `module.parent` is now deprecated in Node.js. As an alternative, `require.main` should be used. To update your code, just change the following line:

```diff
- if (module.parent) {
+ if (require.main !== module) {
```

If `// @ts-ignore` was used to suppress an error, you can delete it.
