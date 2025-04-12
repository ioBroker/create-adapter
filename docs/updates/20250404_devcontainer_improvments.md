# Dev Container Improvements
This document describes the improvements and relevant changes to the Dev Container setup for ioBroker adapter development, focusing on robustness, reliability and usability. Key updates include:

- **Simultaneous Adapter Development:** Enable development of multiple adapters at the same time without conflicts.
- **Robust Setup Process:** Resolve race conditions during container setup to ensure a reliable environment.
- **Support Non-Root User:** Use a non-root user to avoid file permission issues, especially when working with Git.
- **Debugging-Ready Environment:** Automatically prepare everything so debugging works immediately after setup.
- **Minor Improvements:** Schema Updates & Integration Test Support

## Simultaneous Adapter Development
This update enables simultaneous adapter development by dynamically naming containers and using VS Code's dynamic port forwarding to avoid name confusion and port collisions.

### Meaningful Dev Container Names
Previously, all Dev Containers were named `ioBroker Docker Compose`, leading to confusion when working on multiple adapters simultaneously. This improvement dynamically names each container based on the adapter `iobroker.<adapterName>`, making it easier to identify and manage different VS Code instances.

`.devcontainer/devcontainer.json`
```diff
{
-	"name": "ioBroker Docker Compose",
+	"name": "ioBroker.<adapterName>",

```
Example:

![Example with old name](20250404_devcontainer_improvements/devcontainer_name_before.png)

vs.

![Example with new name](20250404_devcontainer_improvements/devcontainer_name_after.png)

### Remove Static Host Port Mapping
Previously, the NGINX service in the Dev Container was mapped to a fixed host port (`8082`), which caused conflicts when running multiple containers simultaneously. Only one container could bind to the port, making it impossible to work on more than one adapter at a time.

This update removes the static port mapping and instead exposes the NGINX port (`80`) within the container. By avoiding fixed port assignments, multiple containers can now run simultaneously without port conflicts, enabling development of multiple adapters.

`.devcontainer/docker-compose.yml`
```diff
    nginx:
        image: nginx:latest
        depends_on:
            - iobroker
        links:
            - iobroker
        container_name: nginx-<adapterName>
        volumes:
            - ./nginx/nginx.conf:/etc/nginx/nginx.conf
            - ..:/workspace:cached
-       ports:
-           # Make the ioBroker admin available under http://localhost:8082
-           - 8082:80
+       expose:
+           # Port will be forwarded in the devcontainer
+           - 80
```

### Using VS Code Dynamic Port Forwarding
VS Code enables port forwarding for Dev Containers, allowing easy access to container services. The **Ports** panel displays all forwarded ports, including the open NGINX port labeled as **ioBroker Admin UI**. The following configuration fully utilizes this feature, making it simple to identify and access the forwarded ports directly from the panel.

`.devcontainer/devcontainer.json`
```diff
	"dockerComposeFile": [ "docker-compose.yml" ],

+	// Forwarding the nginx port to access ioBroker Admin interface
+	"forwardPorts": ["nginx:80"],
+
+	// Name of the forwarded port
+	"portsAttributes": {
+		"nginx:80": {
+			"label": "ioBroker Admin UI"
+		}
+	},
	// The 'service' property is the name of the service for the container that VS Code should
	// use. Update this value and .devcontainer/docker-compose.yml to the real service name.
	"service": "iobroker",
```

## Robust Setup Process
Previously, the setup process faced unpredictable issues due to a race condition and persistent volume storing ioBroker data, which made recreating the Dev Container unreliable. These problems have been resolved by externalizing setup logic into a script that ensures ioBroker is fully ready before proceeding and by removing the persistent volume, allowing the Dev Container to be rebuilt cleanly without leftover state.

### Improve `postCreateCommand` and Add `postStartCommand`
The ioBroker docker image takes some time to complete its setup. Since this process runs asynchronously, the `postCreateCommand` may execute efore the setup is finished, leading to a race condition. This is problematic because the `postCreateCommand` inclueds ioBroker commands that depend on a fully initialized ioBroker instance. If the setup is not ready in time, errors occur, and the Dev Container setup may fail. To address this, the `postCreateCommand` now includes logic to wait for ioBroker to finish its startup.

Additionally, it ensures that all dependencies are installed, the adapter is packaged and installed, and an instance is created to be able to immediately start debugging.

To keep the `devcontainer.json` file clean and manageable, this functionality has been moved to an external `postcreate.sh` script.

Furthermore, the ioBroker startup log is now forwarded to the Dev Container log, allowing the user to see the setup progress and any issues that may arise during startup. This visibility is crucial, as it provides insight into the processes that typically run in the background. Since this logging is also necessary for every startup of an already created container, it is handled in the `poststart.sh` script called in the `postStartCommand` lifecycle to ensure consistent behavior across container restarts.

`.devcontainer/devcontainer.json`
```diff
    // Uncomment the next line if you want to keep your containers running after VS Code shuts down.
    // "shutdownAction": "none",

-   // When creating the container, delete unnecessary adapters, disable error reporting, set the license as confirmed, and install/update this adapter
-   "postCreateCommand": "iob del discovery && iob plugin disable sentry && iob object set system.config common.licenseConfirmed=true && NPM_PACK=$(npm pack) && iob url \"$(pwd)/$NPM_PACK\" --debug && rm \"$NPM_PACK\""
+   // Prepare the devcontainer according to the actual adapter
+   "postCreateCommand": "sh .devcontainer/script/postcreate.sh",
+   "postStartCommand": "sh .devcontainer/scripts/poststart.sh",
```

`.devcontainer/scripts/postcreate.sh`
```bash
#!/bin/bash

set -e

# Wait for ioBroker to become ready
sh .devcontainer/scripts/wait_for_iobroker.sh

echo "➡️  Install dependencies"
npm install

echo "➡️  Packaging adapter"
NPM_PACK=$(npm pack)

echo "➡️  Delete discovery adapter"
iob del discovery

echo "➡️  Disable error reporting"
iob plugin disable sentry

echo "➡️  Set the license as confirmed"
iob object set system.config common.licenseConfirmed=true

echo "➡️  Install the adapter"
iob url "$(pwd)/$NPM_PACK" --debug

ADAPTER_NAME=$(jq -r '.name | split(".")[1]' package.json)
echo "➡️  Create a $ADAPTER_NAME instance"
iob add $ADAPTER_NAME

echo "➡️  Stop $ADAPTER_NAME instance"
iob stop $ADAPTER_NAME

echo "➡️  Delete the adapter package"
rm "$NPM_PACK"

touch /tmp/.postcreate_done
```

`.devcontainer/scripts/poststart.sh`
```bash
#!/bin/bash

set -e

# execute poststart only if container was created right before
if [ -e /tmp/.postcreate_done ]; then
    rm  /tmp/.postcreate_done
else
    # Wait for ioBroker to become ready
    sh .devcontainer/scripts/wait_for_iobroker.sh
fi
```

`.devcontainer/scripts/wait_for_iobroker.sh`
```bash
#!/bin/bash

set -e

# Start tailing the iobroker boot log and kill it when the script exits
tail -f -n 100 /opt/iobroker/log/boot.log &
TAIL_PID_BOOT=$!

# Ensure the tail process is killed when the script exits
trap "kill $TAIL_PID_BOOT" EXIT

# wait for ioBroker to become ready
echo "⏳ Waiting for ioBroker to become ready..."

ATTEMPTS=20
SLEEP=0.5
i=1

while [ $i -le $ATTEMPTS ]; do
    if iob status > /dev/null 2>&1; then
        echo "✅ ioBroker is ready."
        break
    else
        echo "⌛ Attempt $i/$ATTEMPTS: Waiting for ioBroker..."
        sleep $SLEEP
        i=$((i + 1))
    fi
done

if ! iob status > /dev/null 2>&1; then
    echo "❌ Timeout: ioBroker did not become ready in time"
    exit 1
fi
```

### Overwrite `ENTRYPOINT` to Make Logs Visible in the Dev Container
The boot script of the ioBroker Docker image currently writes its output to `stdout`/`stderr`, which is not visible in the Dev Container's startup log.

This update addresses the issue by overwriting the original `ENTRYPOINT` to forward the log output to a log file. This ensures that the logs can be accessed during the container creation and startup process, making it easier to identify and troubleshoot any issues.

`.devcontainer/iobroker/boot.sh`
```bash
#!/bin/bash

set -e

# Define log file location
LOG_FILE=/opt/iobroker/log/boot.log
mkdir -p /opt/iobroker/log

# Start logging to the file (standard output and error)
exec > >(tee "$LOG_FILE") 2>&1

/opt/scripts/iobroker_startup.sh
```

`.devcontainer/Dockerfile`
```diff
# Support sudo for non-root user
ARG USERNAME=iobroker
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

+COPY boot.sh /opt/iobroker/boot.sh
+RUN chmod +x /opt/iobroker/boot.sh \
+    && mkdir -p /opt/iobroker/log

+ENTRYPOINT ["/bin/bash", "-c", "/opt/iobroker/boot.sh"]
```

### User Extension via Custom Scripts
To customize the Dev Container setup for specific test environments, users are encouraged to extend the setup by appending their own scripts directly in the `devcontainer.json`. For example, users can add `&& sh ./myscript.sh` to the `postCreateCommand` or `postStartCommand` to include additional configuration steps. This approach provides flexibility while keeping the setup process automated.

In this example, the test device is assigned the IP address `192.168.0.254`, and the request interval is set to `10s`. To ensure these settings persist after recreating the Dev Container, it is recommended to include the relevant configuration in a script.

`.devcontainer/scripts/myconfig.sh`:
```bash
#!/bin/bash

set -e

# configure test device ip and interval
iob object set system.adapter.hello-world.0 native.host=192.168.0.254
iob object set system.adapter.hello-world.0 native.interval=10
```

`.devcontainer/devcontainer.json`

```diff
-   "postStartCommand": "sh ./devcontainer/scripts/poststart.sh &&"
+   "postStartCommand": "sh ./devcontainer/scripts/poststart.sh && sh ./devcontainer/scripts/myconfig.sh`
```

## Removing Volume of ioBroker Container
If the ioBroker data is stored in a separate volume, it can lead to unexpected issues when rebuilding the Dev Container.

For instance, upgrading the ioBroker Docker image to a newer version may not work as intended because the container does not update the state persisted in the volume.

Additionally, in some scenarios, the lock on `objects.jsonl` is not released by Redis, preventing the Dev Container from starting. This lock resides in the persisted volume, requiring manual intervention to either modify the file or delete the entire volume. A common error message in such cases is:

`Server Cannot start inMem-objects on port 9001: Failed to lock DB file "/opt/iobroker/iobroker-data/objects.jsonl"!`

Note that the port in the error message is incorrectly logged - Redis attempts to start on port 29001 (as configured below), and the port is not actually in use. This suggests a file-level lock that was not properly released.

With this update, the Dev Container can always be rebuilt cleanly without side effects.

As a result, all configuration required for adapter development should now be included as part of the container setup. This configuration will persist across multiple VS Code development sessions as long as the container is not manually deleted or rebuilt.

`.devcontainer/docker-compose.yml`:

Remove the volume mapping:
```diff
    iobroker:
        build: ./iobroker
        container_name: iobroker-<adapterName>
        hostname: iobroker-<adapterName>
        # This port is only internal, so we can work on this while another instance of ioBroker is running on the host
        expose:
            - 8081
        volumes:
            - ..:/workspace:cached
-           - iobrokerdata-<adapterName>:/opt/iobroker
        environment:
```

Remove the volume:
```diff
        ports:
            # Make the ioBroker admin available under http://localhost:8082
            - 8082:80
-
-volumes:
-   iobrokerdata-<adapterName>:
```

## Support Non-Root User
Previously, debugging worked only with the root user, but using root caused file permission issues. Files created in the Dev Container, including `.git` internals, were owned by root, leading to conflicts when working with the repository on the host. Ideally, a non-root user with the same user ID as the host would avoid these issues, but debugging failed in this setup due to a Node.js bug requiring specific capabilities for raw socket development and the placement of the global `node_modules` which only worked for root.

### Change Default User to `iobroker`
The `iobroker` user used by the ioBroker base Docker image (with ID 1000, typically matching the host user ID) is now used as the default non-root user. This avoids file permission conflicts with the host system and ensures compatibility with Git operations.

`.devcontainer/devcontainer.json`
```diff
-	// Uncomment to connect as a non-root user. See https://aka.ms/vscode-remote/containers/non-root.
-   //"remoteUser": "iobroker"
+   // Connect as non-root user. See https://aka.ms/vscode-remote/containers/non-root.
+   "remoteUser": "iobroker"
```

### Make Global `node_modules` Accessible for Non-Root Users
This addresses the issue where the global `node_modules` in `/opt/iobroker/node_modules` directory in the Dev Container was symlinked in a way that only the root user could access it (`/root/.node_modules`). As a result, non-root users encountered the error `Cannot find js-controller`, which prevented debugging from working. To resolve this, a symlink is created at `/node_modules` instead, making the directory resolvable to both root and non-root users.

`.devcontainer/Dockerfile`
```diff
FROM iobroker/iobroker:latest
-RUN ln -s /opt/iobroker/node_modules/ /root/.node_modules
+RUN ln -s /opt/iobroker/node_modules/ /node_modules
```

### Workaround Node.JS Debugging Issue
To debug non-root code using raw sockets (which requires the `cap_net_raw` capability) in a Dev Container with VS Code, a workaround was introduced to address [Node.js issue #37588](https://github.com/nodejs/node/issues/37588). This issue prevents the `NODE_OPTIONS` environment variable from being respected when running Node.js with capabilities as a non-root user.

The workaround uses a wrapper script for the Node.js binary. The script reads the NODE_OPTIONS environment variable, converts its contents into standard command-line arguments, and passes them to the actual Node.js binary (`node.real`). This ensures that debugging and other features relying on `NODE_OPTIONS` work correctly for non-root users, enabling seamless development in the Dev Container.

`.devcontainer/iobroker/node-wrapper.sh`
```bash
#!/bin/bash

# Wrap the Node.js binary to handle NODE_OPTIONS as command-line arguments.
# This workaround addresses https://github.com/nodejs/node/issues/37588, where
# NODE_OPTIONS is not respected when running Node.js with capabilities as a non-root user.
# The wrapper script reads the NODE_OPTIONS environment variable and converts it into
# standard command-line arguments. For example:
# NODE_OPTIONS=--inspect node main.js
# becomes:
# node.real --inspect main.js
# This ensures debugging, and other features relying on NODE_OPTIONS work properly
# for non-root users, such as in VS Code Remote Containers.

NODE_ARGS=()

if [[ -n "$NODE_OPTIONS" ]]; then
	eval "read -r -a NODE_ARGS <<< \"$NODE_OPTIONS\""
	unset NODE_OPTIONS
fi

REAL_NODE="$(command -v node).real"
exec "$REAL_NODE" "${NODE_ARGS[@]}" "$@"
```

`.devcontainer/Dockerfile`
```diff
FROM iobroker/iobroker:latest
RUN ln -s /opt/iobroker/node_modules/ /node_modules
+
+COPY node-wrapper.sh /usr/bin/node-wrapper.sh
+RUN chmod +x /usr/bin/node-wrapper.sh \
+	&& NODE_BIN="$(command -v node)" \
+	# Move the original node binary to .real
+	&& mv "$NODE_BIN" "${NODE_BIN}.real" \
+   # Move the wrapper in place
+	&& mv /usr/bin/node-wrapper.sh "$NODE_BIN"
```

### Add `sudo` Support for Non-Root User
Previously, the non-root user lacked `sudo` privileges, which could be limiting in certain development scenarios. This update adds `sudo` support for the `iobroker` user, allowing it to execute commands with elevated privileges without requiring a password. This ensures greater flexibility while maintaining a secure and efficient development environment.

`.devcontainer/Dockerfile`
```diff
    # Move the wrapper in place
    && mv /usr/bin/node-wrapper.sh "$NODE_BIN"
+
+# Support sudo for non-root user
+ARG USERNAME=iobroker
+RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/+$USERNAME \
+	&& chmod 0440 /etc/sudoers.d/$USERNAME
```

## Debugging-Ready Environment
[Make Global `node_modules` Accessible for Non-Root Users](#make-global-node_modules-accessible-for-non-root-users) and [Workaround Node.JS Debugging Issue](#workaround-nodejs-debugging-issue) were the primary obstacles preventing seamless debugging. The final missing piece is a launch configuration. With this in place, users can press F5 or launch the configuration, enabling debugging to work immediately after the container starts without requiring any additional adjustments.

`.vscode/launch.json`
```json
{
	// Use IntelliSense to learn about possible attributes.
	// Hover to view descriptions of existing attributes.
	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
	"version": "0.2.0",
	"configurations": [
		{
			"type": "node",
			"request": "launch",
			"name": "Launch ioBroker Adapter",
			"skipFiles": ["<node_internals>/**"],
			"args": ["--debug", "0", "--logs"],
			"program": "${workspaceFolder}/main.js",
			"console": "integratedTerminal",
		}
	]
}
```

## Minor Improvements

### Removing Obsolete `version` Attribute
Docker removed the `version` attribute from the docker-compose schema, so do we.

`.devcontainer/docker-compose.yml`:
```diff
-version: '3'
-
services:
```

## Update `settings` and `extensions` in `devcontainer.json`
The `settings` and `extensions` fields have been relocated to `customization/vscode` to align with the updated Dev Container JSON schema.

`.devcontainer/devcontainer.json`
```diff
    "workspaceFolder": "/workspace",
    
-    // Set *default* container specific settings.json values on container create.
-    "settings": {},
-
-	// Add the IDs of extensions you want installed when the container is created.
-	"extensions": [<YOUR_EXTENSIONS>],
+	"customizations": {
+		"vscode": {
+			// Set *default* container specific settings.json values on container create.
+			"settings": {},
+
+			// Add the IDs of extensions you want installed when the container is created.
+			"extensions": [<YOUR_EXTENSIONS>]
+		}
+	},

```

## Support Integration Tests in Dev Container
Integration tests previously failed to start in the Dev Container because ports 9000 and 9001 were already in use by the container causing conflicts when the tests attempted to spawn Redis instances. To resolve this, the Dev Container now uses different Redis ports (29000 and 29001), ensuring no conflicts occour. Additionally, the `host` and `type` environment variables must be explicitly specified, as the internal algorithm requires these settings to correctly use the new ports. Simply defining the port variable alone is insufficient.

`.devcontainer/docker-compose.yml`:
```diff
   iobroker:
        build: ./iobroker
        container_name: iobroker-<adapterName>
        hostname: iobroker-<adapterName>
        # This port is only internal, so we can work on this while another instance of ioBroker is running on the host
        expose:
            - 8081
        volumes:
            - ..:/workspace:cached
        environment:
+           - IOB_OBJECTSDB_TYPE=jsonl
+           - IOB_OBJECTSDB_HOST=127.0.0.1
+           - IOB_OBJECTSDB_PORT=29001
+           - IOB_STATESDB_TYPE=jsonl
+           - IOB_STATESDB_HOST=127.0.0.1
+           - IOB_STATESDB_PORT=29000
            - LANG=en_US.UTF-8
            - LANGUAGE=en_US:en
            - LC_ALL=en_US.UTF-8
            - TZ=Europe/Berlin
            - SETGID=1000
```