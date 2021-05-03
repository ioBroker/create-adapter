/* eslint-disable @typescript-eslint/explicit-member-accessibility */
// This file patches the broken enquirer typings
import "enquirer";
import { EventEmitter } from "events";

declare module "enquirer" {
	export interface BasePromptOptions {
		name: string | (() => string);
		type: string | (() => string);
		message: string | (() => string) | (() => Promise<string>);
		initial?: any;
		required?: boolean;
		format?(value: string): string | Promise<string>;
		result?(value: string): string | Promise<string>;
		skip?:
			| ((state: Record<string, unknown>) => boolean | Promise<boolean>)
			| boolean;
		validate?(
			value: string,
		): boolean | Promise<boolean> | string | Promise<string>;
		onSubmit?(
			name: string,
			value: any,
			prompt: Prompt,
		): boolean | Promise<boolean>;
		onCancel?(
			name: string,
			value: any,
			prompt: Prompt,
		): boolean | Promise<boolean>;
		stdin?: NodeJS.ReadStream;
		stdout?: NodeJS.WriteStream;
	}

	export interface Choice {
		name?: string;
		message?: string;
		value?: string;
		hint?: string;
		disabled?: boolean | string;
	}

	export interface ArrayPromptOptions extends BasePromptOptions {
		type:
			| "autocomplete"
			| "editable"
			| "form"
			| "multiselect"
			| "select"
			| "survey"
			| "list"
			| "scale";
		choices: string[] | Choice[];
		maxChoices?: number;
		muliple?: boolean;
		initial?: number | number[] | string;
		hint?: string;
		delay?: number;
		separator?: boolean;
		sort?: boolean;
		linebreak?: boolean;
		edgeLength?: number;
		align?: "left" | "right";
		scroll?: boolean;
	}

	export interface BooleanPromptOptions extends BasePromptOptions {
		type: "confirm";
		initial?: boolean;
	}

	export interface StringPromptOptions extends BasePromptOptions {
		type: "input" | "invisible" | "list" | "password" | "text";
		hint?: string;
		initial?: string;
		multiline?: boolean;
	}

	export interface NumberPromptOptions extends BasePromptOptions {
		type: "numeral";
		min?: number;
		max?: number;
		delay?: number;
		float?: boolean;
		round?: boolean;
		major?: number;
		minor?: number;
		initial?: number;
	}

	export interface SnippetPromptOptions extends BasePromptOptions {
		type: "snippet";
		newline?: string;
	}

	export interface SortPromptOptions extends BasePromptOptions {
		type: "sort";
		hint?: string;
		drag?: boolean;
		numbered?: boolean;
	}

	export type PromptOptions =
		| ArrayPromptOptions
		| BooleanPromptOptions
		| StringPromptOptions
		| NumberPromptOptions
		| SnippetPromptOptions
		| SortPromptOptions
		| BasePromptOptions;
	export type SpecificPromptOptions =
		| ArrayPromptOptions
		| BooleanPromptOptions
		| StringPromptOptions
		| NumberPromptOptions
		| SnippetPromptOptions
		| SortPromptOptions;

	class BasePrompt extends EventEmitter {
		constructor(options?: PromptOptions);

		render(): void;

		run(): Promise<any>;
	}

	class Enquirer<T = Record<string, unknown>> extends EventEmitter {
		constructor(options?: Record<string, unknown>, answers?: T);

		/**
		 * Register a custom prompt type.
		 *
		 * @param type
		 * @param fn `Prompt` class, or a function that returns a `Prompt` class.
		 */
		register(
			type: string,
			fn: typeof BasePrompt | (() => typeof BasePrompt),
		): this;

		/**
		 * Register a custom prompt type.
		 */
		register(type: {
			[key: string]: typeof BasePrompt | (() => typeof BasePrompt);
		}): this;

		/**
		 * Prompt function that takes a "question" object or array of question objects,
		 * and returns an object with responses from the user.
		 *
		 * @param questions Options objects for one or more prompts to run.
		 */
		prompt(
			questions:
				| PromptOptions
				| ((this: Enquirer) => PromptOptions)
				| (PromptOptions | ((this: Enquirer) => PromptOptions))[],
		): Promise<T>;

		/**
		 * Use an enquirer plugin.
		 *
		 * @param plugin Plugin function that takes an instance of Enquirer.
		 */
		use(plugin: (this: this, enquirer: this) => void): this;
	}

	namespace Enquirer {
		function prompt<T = Record<string, unknown>>(
			questions:
				| PromptOptions
				| ((this: Enquirer) => PromptOptions)
				| (PromptOptions | ((this: Enquirer) => PromptOptions))[],
		): Promise<T>;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		class Prompt extends BasePrompt {}
	}
}
