# Remove rsync from parcel devcontainer

This migration is **only relevant** if you're using a **React UI** for Admin.

Since the introduction of [VSCode devcontainers](./20200902_vscode_devcontainers.md) we were using our own file system polling for the `parcel` container.
Because parcel (or rather Chokidar) supports polling, the container setup can be simplified.

## Simple migration

-   Recreate the `.devcontainer` folder or copy it from the template on GitHub
-   Replace the `parcel` container definition in `./.devcontainers/docker-compose.yml` with the newly created
-   Delete the folder `./.devcontainers/parcel` and replace it with the newly generated folder of the same name
-   Rebuild the remote container with the following command in VS Code:
    `Remote-Containers: Rebuild Container`

## Manual migration

-   Change the `parcel` section of `./.devcontainers/docker-compose.yml` to the following (add the environment variable `CHOKIDAR_USEPOLLING`):

```yml
parcel:
    container_name: parcel-<YOUR_ADAPTER_NAME>
    build: ./parcel
    expose:
        - 1234
    ports:
        - "1235:1235"
    volumes:
        - ..:/workspace:cached
    environment:
        - CHOKIDAR_USEPOLLING=1
```

-   Remove the following two scripts in `./.devcontainers/parcel/`
    -   `run-sync.sh`
    -   `sync.sh`
-   Change `./.devcontainers/parcel/run.sh` to contain the following:

```bash
#!/bin/bash
cd /workspace

echo "Installing all dependencies..."
npm install

npm run watch:parcel
```

-   Change `./.devcontainers/parcel/Dockerfile` to contain the following:

```Dockerfile
FROM node:12

RUN mkdir -p /usr/app

COPY *.sh /usr/app/

CMD /bin/bash -c "/usr/app/run.sh"
```

-   Rebuild the remote container with the following command in VS Code:
    `Remote-Containers: Rebuild Container`
