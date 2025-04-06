# Dev Container Improvements

## Useful Dev Container name in `devcontainer.json`
Every created Dev Container has the same name (`ioBroker Docker Compose`) which causes confusion if working with more than one adapter. 
This change is using the adapter name instead (`iobroker.<adapterName>`) to be able to distinguish between different VS Code instances easily.

```diff
{
-	"name": "ioBroker Docker Compose",
+	"name": "iobroker.<adapterName>",

```
Example:

![Example with old name](20250404_devcontainer_improvements/devcontainer_name_before.png)

vs.

![Example with new name](20250404_devcontainer_improvements/devcontainer_name_after.png)

## VS Code Forwarding Ports in `devcontainer.json`
VS Code supports port forwarding of Dev Container ports. A panel "Ports" shows all forwarded ports of a Dev Container. The following configuration is utilizing this feature completely. It will show the open NGINX port, labled with **ioBroker** and displayed within the ports panel which can be easily opened. 

```diff
	"dockerComposeFile": [ "docker-compose.yml" ],

+	// Forwarding the nginx port to access ioBroker Admin interface
+	"forwardPorts": ["nginx:80"],
+
+	// Name of the forwarded port
+	"portsAttributes": {
+        "nginx:80": {
+            "label": "ioBroker"
+        }
+    },
     // Uncomment the next line if you want start specific services in your Docker Compose config.
     // "runServices": [],

```

## Update `settings` and `extensions` in `devcontainer.json`
Move `settings` and `extensions` into `customization/vscode` as it was moved within the Dev Container Json schema.

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

### Externalize `postCreateCommand`
Add `postcreate.sh` script and put all `postCreateCommand` commands into for a better readability.

`devcontainer.json`
```diff
    // Uncomment the next line if you want to keep your containers running after VS Code shuts down.
    // "shutdownAction": "none",

-   // When creating the container, delete unnecessary adapters, disable error reporting, set the license as confirmed, and install/update this adapter
-   "postCreateCommand": "iob del discovery && iob plugin disable sentry && iob object set system.config common.licenseConfirmed=true && NPM_PACK=$(npm pack) && iob url \"$(pwd)/$NPM_PACK\" --debug && rm \"$NPM_PACK\""
+   // Prepare the devcontainer according to the actual adpater
+   "postCreateCommand": "sh .devcontainer/postcreate.sh",
```

Add new file `postcreate.sh` in `.devcontainer` directory:
```bash
#!/bin/bash

set -e

# delete discovery adapter
iob del discovery

# disable error reporting
iob plugin disable sentry

# set the license as confirmed
iob object set system.config common.licenseConfirmed=true

# package the adapter
NPM_PACK=$(npm pack)

# install the adapter
iob url \"$(pwd)/$NPM_PACK\" --debug

# create a new adapter instance
iob add <ADAPTER-NAME>

# stop the newly created instance
iob stop <ADAPTER-NAME>

# delete the adapter package
rm \"$NPM_PACK\"

# execute custom postcreate script if existing
if [ -e .devcontainer/postcreate_ext.sh ]; then
    sh .devcontainer/postcreate_ext.sh
fi
```

Before the user could debug the given adapter, they need to manually create a new instance. `postcreate.sh` now takes care to create a new instance of the adapter in question and stops it immediately. This allows the user to immediately start the adpater out of VS Code.

### User Extension `postcreate_ext.sh"
To develop an adpater it is often necessary to configure it according a given test setup. As a Dev Container shall set up everything as automated as possible, the user get a callback to create their own shell script (`postcreate_ext.sh`) which is called if existing. Using `set -e` is recommended so the `postCreateCommand` will automatically fail if the custom script fails.

Examplary `postcreate_ext.sh`:
```bash
#!/bin/bash

set -e
# configure test device ip and interval
iob object set system.adapter.valloxmv.0 native.host=192.168.0.254
iob object set system.adapter.valloxmv.0 native.interval=10
```

### Make non-root user default
In the current default configuration, working in the Dev Container causes changing the file permissions from your user to root. It also will change files within `.git` if one is using Git in VS Code. This will cause permission issues if working with the files outside of the Dev Container, like triggering release scripts or pushing to Git. 

The change uses the `remoteUser` iobroker which is the user in the iobroker base image. The user id typically matches to a developer setup where the main user is also 1000.

Change the remote user:
```diff
-    // Uncomment to connect as a non-root user. See https://aka.ms/vscode-remote/containers/non-root.
-    //"remoteUser": "iobroker"

+    // Comment to connect as a root user. See https://aka.ms/vscode-remote/containers/non-root.
+    "remoteUser": "iobroker"
}
```

## Removing obsolete `version` attribute
Docker removed the `version` attribute from the schema.

Remove the version attribute in `docker-compose.yml`:
```diff
-version: '3'
-
services:
```

## Removing Volume of ioBroker Container in `docker-compose.yml`
If the ioBroker data is stored in a separate volume this state can cause unexpected side effects when the user wants to rebuild the Dev Container. 

For example, changing the iobroker docker image to a newer version will not work as expected, as the container doesn't take care about updating the state persisted in the volume.

Another problem is that the lock of `objects.jsonl` is not released from Redis in some scenarios causing the Dev Container to not be able to start anymore. The lock is within the persisted volume and a user would need to tamper it manually inside or delete the whole volume. This is the typical error:

`Server Cannot start inMem-objects on port 9001: Failed to lock DB file "/opt/iobroker/iobroker-data/objects.jsonl"!`

Be aware, that the port is wrongly printed, Redis wants to start at 29001 (see below) and the port is not used yet. So it looks like a file-level lock which wasn't released correctly.

With this change, the Dev Container can be always rebuilt correctly without side effects.

This means, that all configuration which is needed to start developing a adapter must also be part of the container setup. The configuration within the container will survive as long as no container rebuild is triggered. This means the configuration is persisted over several VS Code development sessions as long as the container is not deleted manually.

Remove the volume mapping in `docker-compose.yml`:
```diff
    iobroker:
        build: ./iobroker
        container_name: iobroker-valloxmv
        hostname: iobroker-valloxmv
        # This port is only internal, so we can work on this while another instance of ioBroker is running on the host
        expose:
            - 8081
        volumes:
            - ..:/workspace:cached
-           - iobrokerdata-valloxmv:/opt/iobroker
        environment:
```
Remove the volume:
```diff
        ports:
            # Make the ioBroker admin available under http://localhost:8082
            - 8082:80
-
-volumes:
-   iobrokerdata-valloxmv:
```

## Use non-default Redis ports to allow adapter integration tests
Integration tests will will not pass within a Dev Container because ports 9000 and 9001 is already used by the container. The integration test needs to spawn Redis, too which will fail due ports already been in use. 
This change will cause the Dev Container using different Redis ports 29000 and 29001 to make integration test work. Unfortunately, host and type also needs to be specified, otherwise the internal algorithm will not use the port. Only having the port variable will not have any effect.

Add host/port/type environment variables in `docker-compose.yml`:
```diff
   iobroker:
        build: ./iobroker
        container_name: iobroker-valloxmv
        hostname: iobroker-valloxmv
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

## Remove static host port
Mapping the Nginx to host port 8082 will make it impossible to develop two adapters at the same time. Only one Dev Container can be up because each container wants to use 8082. 
VS Code has a feature to find a free host port dynamically and offers the link within the ports panel. This is the recommended way forwarding ports from host to container.

Remove port mapping and add port expose instead in `docker-compose.yml`:
```diff
    nginx:
        image: nginx:latest
        depends_on:
            - iobroker
        links:
            - iobroker
        container_name: nginx-valloxmv
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