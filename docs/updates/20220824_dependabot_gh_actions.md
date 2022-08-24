# Auto-update github actions via Dependabot

Besides auto-updating your dependencies, Dependabot can also update GitHub Actions which are in use. We also took this chance to reduce the open pull request limit to a sane value, since the current value of 20 keeps GitHub Actions busy all day just rebasing the Dependabot PRs.

After this change, your `.github/dependabot.yml` file should look like this - don't forget to replace `YOUR_NAME_HERE` with your GitHub account name:

<!-- prettier-ignore -->
```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: monthly
      time: "04:00"
      timezone: Europe/Berlin
    open-pull-requests-limit: 5
    assignees:
      - YOUR_NAME_HERE
    versioning-strategy: increase

  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: monthly
      time: "04:00"
      timezone: Europe/Berlin
    open-pull-requests-limit: 5
    assignees:
      - YOUR_NAME_HERE
```
