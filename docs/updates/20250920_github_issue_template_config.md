# Add config.yml to GitHub issue templates with forum link

A new GitHub issue template configuration file has been added to newly created adapters that includes a link to the ioBroker community forum, encouraging users to ask questions there instead of creating GitHub issues.

## What changed

**For newly created adapters:**
- A new file `.github/ISSUE_TEMPLATE/config.yml` is automatically generated
- This file contains configuration that:
  - Disables blank issues (`blank_issues_enabled: false`)
  - Provides a contact link to the ioBroker community forum
  - Displays the message "Please ask and answer questions here"

**Configuration content:**
```yaml
blank_issues_enabled: false
contact_links:
    - name: ioBroker Community
      url: https://forum.iobroker.net/
      about: Please ask and answer questions here.
```

## Manual migration for existing adapters

**This change only affects newly created adapters.** Existing adapters continue to work without any changes required.

However, if you want to add the same forum link configuration to an existing adapter, you can manually add it:

1. Create the directory structure if it doesn't exist:
   ```bash
   mkdir -p .github/ISSUE_TEMPLATE
   ```

2. Create the file `.github/ISSUE_TEMPLATE/config.yml` with the following content:
   ```yaml
   blank_issues_enabled: false
   contact_links:
       - name: ioBroker Community
         url: https://forum.iobroker.net/
         about: Please ask and answer questions here.
   ```

3. Commit and push the changes to your repository.
4. 
