# Add responsive size attributes to jsonConfig template

The jsonConfig template now includes responsive size attributes to follow current best practices for ioBroker admin UI layouts. If you have an existing adapter with jsonConfig, you should consider adding these attributes for better responsive design.

## What changed

The `generateSetting` function in `templates/admin/jsonConfig.json.ts` now includes Bootstrap-style responsive size attributes for all input types:

```json
{
  "xs": 12,
  "sm": 12,
  "md": 6,
  "lg": 4,
  "xl": 4
}
```

These attributes control how form fields are displayed across different screen sizes in the admin UI.

## How to update your adapter

If you have an existing adapter with `admin/jsonConfig.json`, you can manually add the responsive size attributes to improve the layout across different screen sizes.

**Before:**
```json
{
  "type": "text",
  "label": "option1",
  "newLine": true
}
```

**After:**
```json
{
  "type": "text",
  "label": "option1",
  "newLine": true,
  "xs": 12,
  "sm": 12,
  "md": 6,
  "lg": 4,
  "xl": 4
}
```

## Layout options reference

For detailed information about layout options and responsive attributes in jsonConfig, please refer to the official documentation:
https://github.com/ioBroker/ioBroker.admin/blob/master/packages/jsonConfig/README.md#layout-options-xllgmdsmxs

## Benefits

- Better responsive design across different screen sizes
- Consistent layout with current ioBroker admin UI standards
- More professional appearance on tablets and mobile devices
- Follows Bootstrap grid system conventions