FROM iobroker/iobroker:latest
RUN ln -s /opt/iobroker/node_modules/ /root/.node_modules
# Needed to use git-ssh in devcontainer
RUN apt-get update \
	&& apt-get -y --no-install-recommends install openssh-client