export async function subscribeObjectsAsync(pattern: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("subscribeObjects", pattern, async (error) => {
			if (error) reject(error);
			resolve();
		});
	});
}

export async function subscribeStatesAsync(pattern: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("subscribeStates", pattern, async (error) => {
			if (error) reject(error);
			resolve();
		});
	});
}

export async function unsubscribeObjectsAsync(pattern: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("unsubscribeObjects", pattern, async (error) => {
			if (error) reject(error);
			resolve();
		});
	});
}

export async function unsubscribeStatesAsync(pattern: string): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("unsubscribeStates", pattern, async (error) => {
			if (error) reject(error);
			resolve();
		});
	});
}

export async function setStateAsync(
	id: string,
	value: Parameters<ioBroker.Adapter["setStateAsync"]>[1],
): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.emit("setState", id, value, (err, result) => {
			if (err) reject(err);
			resolve();
		});
	});
}

export async function getStateAsync(id: string): Promise<ioBroker.State> {
	return new Promise((resolve, reject) => {
		// retrieve all devices
		socket.emit("getState", id, (err, state?: ioBroker.State) => {
			if (err) reject(err);
			resolve(state);
		});
	});
}