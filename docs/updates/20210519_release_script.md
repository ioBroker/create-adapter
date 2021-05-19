# Support for release-script

If you wish to add the release-script to your project, please follow these steps (taken from the [official documentation](https://github.com/AlCalzone/release-script/blob/master/README.md#installation)):

## Installation

1. Add this module to your `devDependencies`:

    ```bash
    npm i -D @alcalzone/release-script
    ```

2. Add a new `npm` script in `package.json`:

    ```json
    "scripts": {
        ... other scripts ...
        "release": "release-script"
    }
    ```

3. Add a placeholder to `README.md` (for your own convenience)

    ```md
    ## Changelog

    <!--
    	Placeholder for the next version (at the beginning of the line):
    	### **WORK IN PROGRESS**
    -->
    ```

    or `CHANGELOG.md` if you prefer to have a separate changelog (notice that there is one less `#`):

    ```md
    # Changelog

    <!--
    	Placeholder for the next version (at the beginning of the line):
    	## **WORK IN PROGRESS**
    -->
    ```

## More information

For further information, check the [official documentation](https://github.com/AlCalzone/release-script#release-script).
