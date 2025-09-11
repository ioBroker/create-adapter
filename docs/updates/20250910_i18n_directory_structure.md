# Use new i18n directory structure

The i18n directory structure for newly created adapters has been updated to use a flatter, more consistent approach. This change aligns with the structure already used by React admin UIs and makes the directory layout cleaner and easier to navigate.

## What changed

**Old structure (deprecated for new adapters):**
```
admin/i18n/en/translations.json
admin/i18n/de/translations.json
admin/i18n/es/translations.json
...
```

**New structure (used for new adapters):**
```
admin/i18n/en.json
admin/i18n/de.json
admin/i18n/es.json
...
```

## Manual migration for existing adapters

**This change only affects newly created adapters.** Existing adapters continue to work without any changes required.

However, if you want to update an existing adapter to use the new structure for consistency, you can manually migrate:

1. Move translation files from subdirectories to the parent i18n directory:
   ```bash
   mv admin/i18n/en/translations.json admin/i18n/en.json
   mv admin/i18n/de/translations.json admin/i18n/de.json
   mv admin/i18n/es/translations.json admin/i18n/es.json
   # ... repeat for all languages
   ```

2. Remove the now-empty language subdirectories:
   ```bash
   rmdir admin/i18n/en admin/i18n/de admin/i18n/es
   # ... repeat for all languages
   ```

3. Update any references in your code that might point to the old file paths (this is rare as most adapters use the admin interface to load translations automatically).

## Why this change

The new structure provides several benefits:

- **Cleaner directory layout**: Eliminates unnecessary nested directories for each language
- **Consistency**: Aligns with the structure already used by React admin UIs (`admin/src/i18n/en.json`)
- **Easier navigation**: Fewer directory levels to navigate when managing translations
- **Simplified maintenance**: Less complex directory structure to understand and maintain

## No functional changes

This change does not affect the functionality of adapters in any way:
- Translation loading continues to work exactly the same
- The ioBroker admin interface automatically detects and uses translations from either structure
- No changes are required to existing adapters
- Both old and new structures remain fully supported