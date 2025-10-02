# Dependabot schedule with specific day of month

To better distribute Dependabot runs across the month and avoid all adapters updating on the same day, the Dependabot schedule now includes a specific day of the month for running updates.

## What changed

The schedule configuration now includes a `day` parameter that specifies when in the month Dependabot should run:

**Before:**
```yaml
schedule:
  interval: monthly
  time: "04:00"
  timezone: Europe/Berlin
```

**After:**
```yaml
schedule:
  interval: monthly
  day: 15
  time: "00:05"
  timezone: Europe/Berlin
```

## Migration

To update your existing `.github/dependabot.yml` file:

1. Open `.github/dependabot.yml`
2. For each update configuration (both `npm` and `github-actions`), add a `day` parameter to the schedule section
3. Choose a day between 2 and 28 (avoiding day 1 and days beyond 28 to ensure the schedule works in all months)
4. Update the `time` to `"00:05"` if you want to align with the new default time
5. Use the same day for all package ecosystems in your repository to keep updates synchronized

**Example:**

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: monthly
      day: 15
      time: "00:05"
      timezone: Europe/Berlin
    open-pull-requests-limit: 5
    assignees:
      - YOUR_NAME_HERE
    versioning-strategy: increase

  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: monthly
      day: 15
      time: "00:05"
      timezone: Europe/Berlin
    open-pull-requests-limit: 5
    assignees:
      - YOUR_NAME_HERE
```

**Tips:**
- Choose any day between 2 and 28 for your repository
- Use the same day for all package ecosystems within a single repository
- Consider picking a day that works well with your maintenance schedule
