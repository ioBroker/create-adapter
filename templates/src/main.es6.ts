import { TemplateFunction } from "../../src/lib/createAdapter";
import { AdapterSettings, getDefaultAnswer } from "../../src/lib/questions";
import { kebabCaseToUpperCamelCase } from "../../src/lib/tools";

const templateFunction: TemplateFunction = async answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useES6Class = answers.es6class === "yes";
	if (!useTypeScript || !useES6Class) return;

	const className = kebabCaseToUpperCamelCase(answers.adapterName);
	const adapterSettings: AdapterSettings[] = answers.adapterSettings || getDefaultAnswer("adapterSettings")!;
	const quote = answers.quotes === "double" ? '"' : "'";
	const t = answers.indentation === "Space (4)" ? "    " : "\t";

	const template = `
/*
 * Created with @iobroker/create-adapter v${answers.creatorVersion}
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";

// Load your modules here, e.g.:
// import * as fs from "fs";

class ${className} extends utils.Adapter {

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "${answers.adapterName}",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on(${quote}objectChange${quote}, this.onObjectChange.bind(this));
		// this.on(${quote}message${quote}, this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// Initialize your adapter here


${answers.connectionIndicator === "yes" ? `
		// Reset the connection indicator during startup
		this.setState("info.connection", false, true);
` : ""}

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
${adapterSettings.map(s => `\t\tthis.log.info("config ${s.key}: " + this.config.${s.key});`).join("\n")}

		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/
		await this.setObjectNotExistsAsync("testVariable", {
			type: "state",
			common: {
				name: "testVariable",
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});

		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		this.subscribeStates("testVariable");
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates(${quote}lights.*${quote});
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates(${quote}*${quote});

		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		await this.setStateAsync("testVariable", true);

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		await this.setStateAsync("testVariable", { val: true, ack: true });

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

		// examples for the checkPassword/checkGroup functions
		let result = await this.checkPasswordAsync("admin", "iobroker");
		this.log.info("check user admin pw iobroker: " + result);

		result = await this.checkGroupAsync("admin", "admin");
		this.log.info("check group user admin group admin: " + result);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (e) {
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
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			// The state was changed
			this.log.info(\`state \${id} changed: \${state.val} (ack = \${state.ack})\`);
		} else {
			// The state was deleted
			this.log.info(\`state \${id} deleted\`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  */
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

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new ${className}(options);
} else {
	// otherwise start the instance directly
	(() => new ${className}())();
}
`;
	return template.trim();
};
templateFunction.customPath = "src/main.ts";
export = templateFunction;
