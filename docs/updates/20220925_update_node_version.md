# Update Node.js version references

A couple of the configuration files for the tools used in adapter development reference the Node.js version directly or indirectly. Since the minimum Node.js version is now 14 (or higher), some of these can be updated. Select the following changes as needed:

## `.eslintrc.js` / `.eslintrc.json`

Update `parserOptions.ecmaVersion` to 2020 (for Node 14, 2021 for Node 16). If this field does not exist, add

```diff
{
	// ... other fields
+	"parserOptions": {
+		"ecmaVersion": 2020
+	}
}
```

The quotes are only necessary in `.json` files, you can remove them for `.js` files.

## `package.json`

ioBroker enforces the minimum Node.js version during adapter installations. To make use of this, add the following to `package.json`:

```diff
{
	// ... other fields
+	"engines": {
+		"node": ">=14"
+	}
}
```

(or `>=16` for Node 16)
