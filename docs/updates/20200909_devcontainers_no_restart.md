# Disable automatic restart of VSCode devcontainers

Since the introduction of [VSCode devcontainers](./20200902_vscode_devcontainers.md) we noticed issues when you have more than one project using devcontainers on your PC.

When restarting the PC, all devcontainers would try to restart which would of course lead to TCP port conflicts.

Migration guide:

-   Remove all lines containing `restart: always` from the file `./.devcontainers/docker-compose.yml` (it sould exist two or three times)
