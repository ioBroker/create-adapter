# Update README installation instructions to use GitHub Custom Install

The README template section for testing adapters manually on a local ioBroker installation has been updated to recommend using ioBroker's GitHub Custom Install feature instead of direct npm installation.

## What changed

The installation instructions in the "Test the adapter manually on a local ioBroker installation" section now recommend installing directly from GitHub using either the Admin UI or command line, instead of creating tarballs and using npm commands.

**Before:**
```markdown
### Test the adapter manually on a local ioBroker installation
In order to install the adapter locally without publishing, the following steps are recommended:
1. Create a tarball from your dev directory:  
	```bash
	npm pack
	```
1. Upload the resulting file to your ioBroker host
1. Install it locally (The paths are different on Windows):
	```bash
	cd /opt/iobroker
	npm i /path/to/tarball.tgz
	```

For later updates, the above procedure is not necessary. Just do the following:
1. Overwrite the changed files in the adapter directory (`/opt/iobroker/node_modules/iobroker.ADAPTER_NAME`)
1. Execute `iobroker upload ADAPTER_NAME` on the ioBroker host
```

**After:**
```markdown
### Test the adapter manually on a local ioBroker installation
In order to install the adapter locally without publishing, the following steps are recommended:
1. Create a GitHub repository for your adapter if you haven't already
1. Push your code to the GitHub repository
1. Use the ioBroker Admin interface or command line to install the adapter from GitHub:
	* **Via Admin UI**: Go to the "Adapters" tab, click on "Custom Install" (GitHub icon), and enter your repository URL:
		```
		https://github.com/YOUR_GITHUB/ioBroker.ADAPTER_NAME
		```
		You can also install from a specific branch by adding `#branchname` at the end:
		```
		https://github.com/YOUR_GITHUB/ioBroker.ADAPTER_NAME#dev
		```
	* **Via Command Line**: Install using the `iob` command:
		```bash
		iob url https://github.com/YOUR_GITHUB/ioBroker.ADAPTER_NAME
		```
		Or from a specific branch:
		```bash
		iob url https://github.com/YOUR_GITHUB/ioBroker.ADAPTER_NAME#dev
		```

For later updates:
1. Push your changes to GitHub
1. Execute `iobroker upload ADAPTER_NAME` on the ioBroker host to upload the updated adapter files
```

## Why this change

The previous instructions recommended using npm directly to install from a tarball, which:
- Required manual file upload to the ioBroker host
- Was error-prone for new developers
- Didn't match modern ioBroker installation practices

The new instructions:
- Use ioBroker's built-in GitHub installation feature
- Are simpler and more user-friendly
- Allow easy installation from different branches (e.g., dev, feature branches)
- Follow current best practices in the ioBroker ecosystem
- Still include the important `iobroker upload` command for updating adapter files

## Migration

If you have an existing adapter project, you can update the README.md manually:

1. Open your `README.md` file
2. Locate the "Test the adapter manually on a local ioBroker installation" section
3. Replace the content with the new installation instructions shown above
4. Update the GitHub URLs with your actual GitHub username and adapter name
5. Commit the changes

**Note:** This is a documentation-only change. No code changes are required.
