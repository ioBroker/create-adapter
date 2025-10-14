# Switch to npm trusted publishing for automatic releases

npm now supports [trusted publishing](https://docs.npmjs.com/trusted-publishers), which uses OpenID Connect (OIDC) tokens to authenticate GitHub Actions workflows without requiring manual NPM token management. This is more secure and easier to maintain than the traditional token-based approach.

## What changed

The GitHub Actions workflow template has been updated to use trusted publishing:

1. **Permissions updated**: Added `id-token: write` permission to enable OIDC token creation
2. **NPM token removed**: The `npm-token` parameter has been removed from the deploy step
3. **Setup instructions updated**: Instructions now point to npm's trusted publishing guide

## Migration

To update your existing adapter to use trusted publishing:

### 1. Update workflow permissions

Edit `.github/workflows/test-and-release.yml` and update the `deploy` job permissions:

```diff
   # Deploys the final package to NPM
   deploy:
     needs: [check-and-lint, adapter-tests]

     # Trigger this step only when a commit on any branch is tagged with a version number
     if: |
       contains(github.event.head_commit.message, '[skip ci]') == false &&
       github.event_name == 'push' &&
       startsWith(github.ref, 'refs/tags/v')

     runs-on: ubuntu-latest

     # Write permissions are required to create Github releases
     permissions:
+      id-token: write
       contents: write
```

### 2. Remove npm-token parameter

In the same file, remove the `npm-token` line from the deploy step:

```diff
     steps:
       - uses: ioBroker/testing-action-deploy@v1
         with:
           node-version: '20.x'
           # Uncomment the following line if your adapter cannot be installed using 'npm ci'
           # install-command: 'npm install'
           build: true
-          npm-token: ${{ secrets.NPM_TOKEN }}
           github-token: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Set up trusted publishing on npm

Before the workflow can publish to npm using trusted publishing, you need to configure it in your npm account:

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Navigate to your package page
3. Go to **Settings** → **Publishing access**
4. Click **Add provider** under "Trusted publishers"
5. Select **GitHub Actions** as the provider
6. Fill in the following information:
   - **Repository owner**: Your GitHub username or organization (e.g., `yourname`)
   - **Repository name**: Your repository name without owner (e.g., `ioBroker.youradapter`)
   - **Workflow name**: `test-and-release.yml`
   - **Environment name**: Leave empty (unless you use GitHub environments)
7. Click **Add**

For detailed instructions, see the [npm trusted publishers documentation](https://docs.npmjs.com/trusted-publishers).

### 4. Optional: Remove NPM_TOKEN secret

Once you've verified that trusted publishing works correctly, you can remove the `NPM_TOKEN` secret from your GitHub repository settings (Settings → Secrets and variables → Actions).

## Benefits

- **Enhanced security**: No need to store long-lived NPM tokens
- **Simplified setup**: Configure once in your npm account
- **Better audit trail**: npm can verify releases come from your specified repository
- **Automatic token rotation**: OIDC tokens are short-lived and automatically managed
