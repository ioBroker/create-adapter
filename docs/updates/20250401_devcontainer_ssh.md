# Add git-ssh support in DevContainer

To be able to push to git using an ssh url in a DevContainer, ssh is needed in the docker image. 

Make sure to add this change to `.devcontainer/iobroker/Dockerfile`:

```diff
FROM iobroker/iobroker:latest
RUN ln -s /opt/iobroker/node_modules/ /.node_modules
+# Needed to use git-ssh in devcontainer
+RUN apt-get update \
+    && apt-get -y --no-install-recommends install openssh-client
```
