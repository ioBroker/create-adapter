# GitHub Issue Forms (YAML templates)

The bug report template has been converted from Markdown to GitHub issue forms (YAML format), and a new feature request template has been added.

## What changed

**For newly created adapters:**
- The bug report template now uses GitHub issue forms (YAML format) instead of Markdown
- A new feature request template has been added using the same YAML format
- Both templates provide structured forms with required and optional fields

**Replaced files:**
- Removed: `.github/ISSUE_TEMPLATE/bug_report.md` (old Markdown format)
- Added: `.github/ISSUE_TEMPLATE/bug_report.yml` (new YAML form)
- Added: `.github/ISSUE_TEMPLATE/feature_request.yml` (new YAML form)

**Bug report form includes:**
- Introduction and guidance for bug reporters
- Required fields:
  - Bug description
  - Steps to reproduce
  - Expected behavior
  - Adapter version
  - JS-Controller version
  - Node version
  - Operating system
- Optional fields:
  - Checkboxes for log files and screenshots
  - Additional logs and screenshots section
  - Additional context

**Feature request form includes:**
- Introduction and guidance for feature requesters
- Required fields:
  - Proposed solution description
- Optional fields:
  - Problem description
  - Alternative solutions considered
  - Additional context

## Why this change?

GitHub issue forms provide several advantages:
1. **Structured data**: Form responses are parsed into structured data that can be easily processed
2. **Better UX**: Users are guided through form fields instead of editing markdown
3. **Validation**: Required fields ensure critical information is provided
4. **Consistency**: All bug reports follow the same format
5. **Modern approach**: GitHub recommends using issue forms over markdown templates

## Manual migration for existing adapters

**This change only affects newly created adapters.** Existing adapters continue to work without any changes required.

However, if you want to migrate an existing adapter to use the new issue forms:

1. Navigate to your adapter's `.github/ISSUE_TEMPLATE` directory
2. Replace `bug_report.md` with the new `bug_report.yml`:
   - Delete `.github/ISSUE_TEMPLATE/bug_report.md`
   - Copy the new `bug_report.yml` from a newly created adapter or from the [create-adapter repository](https://github.com/ioBroker/create-adapter/blob/master/templates/_github/ISSUE_TEMPLATE/bug_report.raw.yml)
3. Optionally add the new `feature_request.yml` template:
   - Copy `feature_request.yml` from a newly created adapter or from the [create-adapter repository](https://github.com/ioBroker/create-adapter/blob/master/templates/_github/ISSUE_TEMPLATE/feature_request.raw.yml)
4. Commit and push the changes to your repository

Once pushed, GitHub will automatically use the new YAML forms when users create issues.

## Reference

This implementation is based on the example from [ioBroker.trashschedule](https://github.com/klein0r/ioBroker.trashschedule/blob/687a05d5cee39534136999d2525a4b27275f64e7/.github/ISSUE_TEMPLATE/bug_report.yml).

For more information about GitHub issue forms, see the [GitHub documentation](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms).
