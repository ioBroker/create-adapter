import * as React from "react";
import { composeObject, entries } from "alcalzone-shared/objects";

export type OnSettingsChangedCallback = (newSettings: Record<string, unknown>) => void;

interface SettingsProps {
	onChange: OnSettingsChangedCallback;
	settings: Record<string, unknown>;
}

// Define here which settings exist and how they are typed
interface SettingsState {
	// catch-all for new and temporary values
	[key: string]: unknown;
	// they should all be optional, since they might not be set yet
	// e.g. password?: string;
}

/** Example component for editing adapter settings */
export class Settings extends React.Component<SettingsProps, SettingsState> {
	constructor(props: SettingsProps) {
		super(props);
		// settings are our state
		this.state = {
			...props.settings,
		};

		// setup change handlers
		this.handleChange = this.handleChange.bind(this);
		// If you add your own, don't forget to bind them to `this`, e.g.:
		// this.validateNetworkKey = this.validateNetworkKey.bind(this);
	}

	// MaterializeCSS checkboxed are messed up. To fix them, we need to...
	// 1. store every reference to a checkbox in a variable
	// private chkWriteLogFile: HTMLInputElement | null | undefined;
	// 2. add the click event handler in `componentDidMount`
	// if (this.chkWriteLogFile != null) {
	// 	$(this.chkWriteLogFile).on("click", this.handleChange as any);
	// }
	// 3. remove the click handler in `componentWillUnmount`
	// if (this.chkWriteLogFile != null) {
	// 	$(this.chkWriteLogFile).off("click", this.handleChange as any);
	// }

	private parseChangedSetting(target: HTMLInputElement | HTMLSelectElement): unknown {
		// Checkboxes in MaterializeCSS are messed up, so we attach our own handler
		// However that one gets called before the underlying checkbox is actually updated,
		// so we need to invert the checked value here
		return target.type === "checkbox"
			? !(target as any).checked
			: target.type === "number"
			? parseInt(target.value, 10)
			: target.value;
	}

	// gets called when the form elements are changed by the user
	private handleChange(event: React.FormEvent<HTMLElement>): boolean {
		const target = event.target as HTMLInputElement | HTMLSelectElement; // TODO: more types
		const value = this.parseChangedSetting(target);
		return this.updateSettings(target.id, value);
	}

	private updateSettings(setting: string, value: unknown): boolean {
		// store the setting
		this.putSetting(setting, value, () => {
			// and notify the admin UI about changes
			this.props.onChange(composeObject(entries(this.state).filter(([k]) => !k.startsWith("_"))));
		});
		return false;
	}

	/**
	 * Reads a setting from the state object and transforms the value into the correct format
	 * If no value is set, the default value is returned
	 * @param key The setting key to lookup
	 */
	private getSetting(key: string, defaultValue?: unknown): unknown {
		const ret = this.state[key];
		return ret != undefined ? ret : defaultValue;
	}

	/**
	 * Saves a setting in the state object and transforms the value into the correct format
	 * @param key The setting key to store at
	 */
	private putSetting(key: string, value: unknown, callback?: () => void): void {
		this.setState({ [key]: value }, callback);
	}

	public componentDidMount(): void {
		// update floating labels in materialize design
		M.updateTextFields();

		// Add checkbox click handlers here
	}

	public componentWillUnmount(): void {
		// Remove checkbox click handlers here
	}

	public componentDidUpdate(): void {
		// update floating labels in materialize design
		M.updateTextFields();
	}

	public render(): JSX.Element {
		return (
			<>
				<div className="row">
			<div className="col s6 input-field">
				<input type="checkbox" className="value" id="option1" />
				<label htmlFor="option1" className="translate">option1</label>
			</div>

			<div className="col s6 input-field">
				<input type="text" className="value" id="option2" />
				<label htmlFor="option2" className="translate">option2</label>
			</div>
				</div>
			</>
		);
	}
}