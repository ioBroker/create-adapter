import type { AdapterSettings } from "../../src/lib/core/questions";
import { getDefaultAnswer } from "../../src/lib/core/questions";
import type { TemplateFunction } from "../../src/lib/createAdapter";
import { kebabCaseToUpperCamelCase } from "../../src/lib/tools";

const templateFunction: TemplateFunction = async answers => {
	const useTypeScript = answers.language === "TypeScript";
	const useTSWithoutBuild = answers.language === "TypeScript (without build)";
	if (!useTypeScript && !useTSWithoutBuild) {
		return;
	}

	const className = kebabCaseToUpperCamelCase(answers.adapterName);
	const adapterSettings: AdapterSettings[] = answers.adapterSettings || getDefaultAnswer("adapterSettings")!;
	const quote = answers.quotes === "double" ? '"' : "'";
	const t = answers.indentation === "Space (4)" ? "    " : "\t";
	const useESM = answers.moduleType === "esm";

	const template = `/*
 * Created with @iobroker/create-adapter v${answers.creatorVersion}
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from ${quote}@iobroker/adapter-core${quote};${
		useESM
			? `
import { pathToFileURL } from ${quote}url${quote};`
			: ""
	}

// Load your modules here, e.g.:
// import * as fs from ${quote}fs${quote};

class ${className} extends utils.Adapter {
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: ${quote}${answers.adapterName}${quote},
		});
		this.on(${quote}ready${quote}, this.onReady.bind(this));
		this.on(${quote}stateChange${quote}, this.onStateChange.bind(this));
		// this.on(${quote}objectChange${quote}, this.onObjectChange.bind(this));
		// this.on(${quote}message${quote}, this.onMessage.bind(this));
		this.on(${quote}unload${quote}, this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// Initialize your adapter here


${
	answers.connectionIndicator === "yes"
		? `
		// Reset the connection indicator during startup
		this.setState(${quote}info.connection${quote}, false, true);
`
		: ""
}

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
${adapterSettings.map(s => `\t\tthis.log.debug(${quote}config ${s.key}: \${this.config.${s.key}}${quote});`).join("\n")}

		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables

		IMPORTANT: State roles should be chosen carefully based on the state's purpose.
		           Please refer to the state roles documentation for guidance:
		           https://www.iobroker.net/#en/documentation/dev/stateroles.md
		*/
		await this.setObjectNotExistsAsync(${quote}testVariable${quote}, {
			type: ${quote}state${quote},
			common: {
				name: ${quote}testVariable${quote},
				type: ${quote}boolean${quote},
				role: ${quote}indicator${quote},
				read: true,
				write: true,
			},
			native: {},
		});

		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		this.subscribeStates(${quote}testVariable${quote});
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates(${quote}lights.*${quote});
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates(${quote}*${quote});

		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		await this.setState(${quote}testVariable${quote}, true);

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		await this.setState(${quote}testVariable${quote}, { val: true, ack: true });

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		await this.setState(${quote}testVariable${quote}, { val: true, ack: true, expire: 30 });

		// examples for the checkPassword/checkGroup functions
		const pwdResult = await this.checkPasswordAsync(${quote}admin${quote}, ${quote}iobroker${quote});
		this.log.info(\`check user admin pw iobroker: \${JSON.stringify(pwdResult)}\`);

		const groupResult = await this.checkGroupAsync(${quote}admin${quote}, ${quote}admin${quote});
		this.log.info(\`check group user admin group admin: \${JSON.stringify(groupResult)}\`);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 *
	 * @param callback - Callback function
	 */
	private onUnload(callback: () => void): void {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (error) {
			this.log.error(\`Error during unloading: \${(error as Error).message}\`);
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with \`this.subscribeObjects\`, similar to \`this.subscribeStates\`.
	// /**
	//  * Is called if a subscribed object changes
	//  */
	// private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
	// ${t}if (obj) {
	// ${t}${t}// The object was changed
	// ${t}${t}this.log.info(\`object \${id} changed: \${JSON.stringify(obj)}\`);
	// ${t}} else {
	// ${t}${t}// The object was deleted
	// ${t}${t}this.log.info(\`object \${id} deleted\`);
	// ${t}}
	// }

	/**
	 * Is called if a subscribed state changes
	 *
	 * @param id - State ID
	 * @param state - State object
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			// The state was changed
			this.log.info(\`state \${id} changed: \${state.val} (ack = \${state.ack})\`);

			if (state.ack === false) {
				// This is a command from the user (e.g., from the UI or other adapter)
				// and should be processed by the adapter
				this.log.info(\`User command received for \${id}: \${state.val}\`);

				// TODO: Add your control logic here
			}
		} else {
			// The object was deleted or the state value has expired
			this.log.info(\`state \${id} deleted\`);
		}
	}
	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  */
	//
	// private onMessage(obj: ioBroker.Message): void {
	// ${t}if (typeof obj === ${quote}object${quote} && obj.message) {
	// ${t}${t}if (obj.command === ${quote}send${quote}) {
	// ${t}${t}${t}// e.g. send email or pushover or whatever
	// ${t}${t}${t}this.log.info(${quote}send command${quote});
	// ${t}${t}${t}// Send response in callback if required
	// ${t}${t}${t}if (obj.callback) this.sendTo(obj.from, obj.command, ${quote}Message received${quote}, obj.callback);
	// ${t}${t}}
	// ${t}}
	// }
}
${
	useESM
		? `
// ESM module export for compact mode
export default function startAdapter(options?: Partial<utils.AdapterOptions>): ${className} {
	return new ${className}(options);
}

// Start adapter if not loaded as module
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	new ${className}();
}
`
		: `
if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new ${className}(options);
} else {
	// otherwise start the instance directly
	(() => new ${className}())();
}
`
}`;
	return template;
};

export = templateFunction;
