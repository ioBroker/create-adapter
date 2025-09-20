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

## Benefits

This configuration provides several advantages:

- **Better user guidance**: Users see a prominent link to the community forum when creating issues
- **Reduced GitHub noise**: Encourages questions to be asked in the forum rather than as GitHub issues  
- **Consistent experience**: All new adapters will have the same forum link configuration
- **Community engagement**: Directs users to the active community forum where they can get help faster

## Implementation details

The implementation follows the same pattern as the reference implementation in [adapter-react-v5](https://github.com/ioBroker/adapter-react-v5/blob/de08924def4d77e7bc81a0704da1ed615e371550/.github/ISSUE_TEMPLATE/config.yml#L3) and adheres to GitHub's [official documentation for configuring issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository#configuring-the-template-chooser).

## No functional changes to existing adapters

This change does not affect the functionality of existing adapters in any way:
- Existing adapters continue to work exactly the same  
- No changes are required to existing adapters
- The configuration only applies to newly created adapters
- Existing issue templates and workflows remain unchanged