# Use official Docker image for devcontainer

Since the introduction of [VSCode devcontainers](./20200902_vscode_devcontainers.md), the ioBroker Docker image has been migrated to the ioBroker organization. To make use of the new images, you need to update the dockerfile.

Migration guide:

Change the first line in `.devcontainer/iobroker/Dockerfile` from

```Dockerfile
FROM buanet/iobroker:latest
```

to

```Dockerfile
FROM iobroker/iobroker:latest
```
