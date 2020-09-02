# Support for VSCode devcontainers

With VSCode's [devcontainers](https://code.visualstudio.com/docs/remote/containers) you can develop in a fresh and isolated environment which only contains ioBroker, the admin adapter and your new adapter.

All files are synchronized automatically, so there is no need to reinstall or upload changes (except maybe if you change `io-package.json` and want to verify these changes).

Migration guide:

-   Read and follow the **Getting started** section at https://code.visualstudio.com/docs/remote/containers#_getting-started

-   Create a new directory structure with the adapter creator using the correct settings and

    -   copy the entire `.devcontainer` directory
    -   If there is a `"watch:parcel"` script in your adapter's package.json, replace the script with the one from the new `package.json`.

-   Reopen the window in VSCode and click on the **reopen in container** button
-   Open http://localhost:8082 to open the ioBroker admin
-   Add an instance of your adapter. There is no need to install it, since it should already be in the adapter list.
