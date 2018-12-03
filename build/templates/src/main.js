"use strict";
/**
 *
 * template adapter
 *
 *
 *  file io-package.json comments:
 *
 *  {
 *      "common": {
 *          "name":         "template",                  // name has to be set and has to be equal to adapters folder name and main file name excluding extension
 *          "version":      "0.0.0",                    // use "Semantic Versioning"! see http://semver.org/
 *          "title":        "Node.js template Adapter",  // Adapter title shown in User Interfaces
 *          "authors":  [                               // Array of authord
 *              "name <mail@template.com>"
 *          ]
 *          "desc":         "template adapter",          // Adapter description shown in User Interfaces. Can be a language object {de:"...",ru:"..."} or a string
 *          "platform":     "Javascript/Node.js",       // possible values "javascript", "javascript/Node.js" - more coming
 *          "mode":         "daemon",                   // possible values "daemon", "schedule", "subscribe"
 *          "schedule":     "0 0 * * *"                 // cron-style schedule. Only needed if mode=schedule
 *          "loglevel":     "info"                      // Adapters Log Level
 *      },
 *      "native": {                                     // the native object is available via adapter.config in your adapters code - use it for configuration
 *          "test1": true,
 *          "test2": 42
 *      }
 *  }
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
// you have to call the adapter function and pass a options object
// name has to be set and has to be equal to adapters folder name and main file name excluding extension
// adapter will be restarted automatically every time as the configuration changed, e.g system.adapter.template.0
const adapter = utils.adapter({
    name: "template-ts",
    // is called when databases are connected and adapter received configuration.
    // start here!
    ready: main,
    // is called when adapter shuts down - callback has to be called under any circumstances!
    unload: (callback) => {
        try {
            adapter.log.info("cleaned everything up...");
            callback();
        }
        catch (e) {
            callback();
        }
    },
    // is called if a subscribed object changes
    objectChange: (id, obj) => {
        if (obj) {
            // The object was changed
            adapter.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
        }
        else {
            // The object was deleted
            adapter.log.info(`object ${id} deleted`);
        }
    },
    // is called if a subscribed state changes
    stateChange: (id, state) => {
        if (state) {
            // The state was changed
            adapter.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        }
        else {
            // The state was deleted
            adapter.log.info(`state ${id} deleted`);
        }
    },
    // Some message was sent to adapter instance over message box. Used by email, pushover, text2speech, ...
    // requires the property to be configured in io-package.json
    message: (obj) => {
        if (typeof obj === "object" && obj.message) {
            if (obj.command === "send") {
                // e.g. send email or pushover or whatever
                console.log("send command");
                // Send response in callback if required
                if (obj.callback)
                    adapter.sendTo(obj.from, obj.command, "Message received", obj.callback);
            }
        }
    },
});
function main() {
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:
    adapter.log.info("config test1: " + adapter.config.option1);
    adapter.log.info("config test1: " + adapter.config.option2);
    /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
    */
    adapter.setObject("testVariable", {
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
    // in this template all states changes inside the adapters namespace are subscribed
    adapter.subscribeStates("*");
    /*
        setState examples
        you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
    */
    // the variable testVariable is set to true as command (ack=false)
    adapter.setState("testVariable", true);
    // same thing, but the value is flagged "ack"
    // ack should be always set to true if the value is received from or acknowledged from the target system
    adapter.setState("testVariable", { val: true, ack: true });
    // same thing, but the state is deleted after 30s (getState will return null afterwards)
    adapter.setState("testVariable", { val: true, ack: true, expire: 30 });
    // examples for the checkPassword/checkGroup functions
    adapter.checkPassword("admin", "iobroker", (res) => {
        console.log("check user admin pw ioboker: " + res);
    });
    adapter.checkGroup("admin", "admin", (res) => {
        console.log("check group user admin group admin: " + res);
    });
}
