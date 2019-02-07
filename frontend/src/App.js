import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Dropzone from 'react-dropzone';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Comm from './Comm';

import CheckIcon from '@material-ui/icons/DoneOutlined';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const NARROW_WIDTH = 500;

const styles = theme => ({
    toolbarTitle: {
    	paddingLeft: 20,
        position: 'relative',
		fontSize: 16,
        top: 0,
        right: 20
    },
	optional: {
		fontSize: 10,
		color: '#4d4d4d'
	},
	textInputs: {
        width: '100%'
    },
	selectType: {
		marginTop: 15
	},
    buttonCheck: {
        marginLeft: 10,
        marginRight: 20,
    },
	page: {
    	paddingLeft: 20,
    	paddingRight: 20
	},
	typeDesc: {
		fontSize: 10,
		fontStyle: 'italic',
		paddingLeft: 10
	},
	paddingTop: {
		marginTop: 30
	},
    body: {

    },
    ok: {
        color: '#00b200'
    },
    error: {
        color: '#bf0000'
    },
    warning: {
        color: '#bf9100'
    },
	icon: {
    	height: 128,
	},
	iconDrop: {
    	marginTop: 20,
		borderRadius: 5,
		border: '3px dashed lightgray'
	},
	tableRow: {
		verticalAlign: 'top'
	},

	paramsName: {
    	width: 150,
		padding: '0 0 0 8px'
	},
	paramsNameInput: {
		width: '100%'
	},
	paramsTitle: {
		padding: '0 0 0 8px'
	},
	paramsTitleInput: {
    	width: '100%'
	},
	paramsType: {
		width: 100,
		padding: '0 0 0 8px'
	},
	paramsTypeInput: {
		width: '100%'
	},
	paramsOptions: {
		width: 300,
		padding: '0 0 0 8px'
	},
	paramsDef: {
		width: 100,
		padding: '0 0 0 8px'
	},
	paramsDefInput: {
		width: '100%'
	},
	paramsButtons: {
		width: 30,
		padding: '0 0 0 8px'
	},

	optionsText: {
    	width: 'calc(50% - 35px)',
		fontWeight: 'bold',
		display: 'inline-block',
		marginLeft: 5
	},
	optionsValue: {
		width: 'calc(50% - 35px)',
		fontWeight: 'bold',
		paddingRight: 10,
		display: 'inline-block',
		marginLeft: 5
	}
});

function isNotEmpty(answer) {
	return answer !== null && answer !== undefined && typeof answer === 'string' && answer.length > 0 && answer.trim().length > 0;
}

const ADAPTER_TYPES = [
	{ message: "Alarm / security         (Home, car, boat, ...)", value: "alarm" },
	{ message: "Calendars                (also schedules, etc. ...)", value: "date-and-time" },
	{ message: "Climate control          (A/C, Heaters, air filters, ...)", value: "climate-control" },
	{ message: "Communication protocols  (MQTT, ...)", value: "protocols" },
	{ message: "Data storage             (SQL/NoSQL, file storage, logging, ...)", value: "storage" },
	{ message: "Data transmission        (for other services via REST api, websockets, ...)", value: "communication" },
	{ message: "Garden                   (Mowers, watering, ...)", value: "garden" },
	{ message: "General purpose          (like admin, web, discovery, ...)", value: "general" },
	{ message: "Geo positioning          (transmission and receipt of position data)", value: "geoposition" },
	{ message: "Hardware                 (low-level, multi-purpose)", value: "hardware" },
	{ message: "Household devices        (Vacuums, kitchen, ...)", value: "household" },
	{ message: "Lighting control", value: "lighting" },
	{ message: "Logic                    (Scripts, rules, parsers, scenes, ...)", value: "logic" },
	{ message: "Messaging                (E-Mail, Telegram, WhatsApp, ...)", value: "messaging" },
	{ message: "Meters for energy, electricity, ...", value: "energy" },
	{ message: "Meters for water, gas, oil, ...", value: "metering" },
	{ message: "Miscellaneous data       (Import/export of contacts, gasoline prices, ...)", value: "misc-data" },
	{ message: "Miscellaneous utilities  (Data import/emport, backup, ...)", value: "utility" },
	{ message: "Multimedia               (TV, audio, remote controls, ...)", value: "multimedia" },
	{ message: "Network infrastructure   (Hardware, printers, phones, ...)", value: "infrastructure" },
	{ message: "Network utilities        (Ping, UPnP, network discovery, ...)", value: "network" },
	{ message: "Smart home systems       (3rd party, hardware and software)", value: "iot-systems" },
	{ message: "Visualizations           (VIS, MaterialUI, mobile views, ...)", value: "visualization" },
	{ message: "Weather                  (Forecast, air quality, statistics, ...)", value: "weather" },
];

class App extends Component {
    constructor(props) {
        super(props);

		this.steps = [
			{name: 'Name and icons',     render: this.renderStepNames,      optional: false, checkers: [this.checkTitle, this.checkAdapterName, this.checkType]},
			{name: 'Running properties', render: this.renderStepProperties, optional: false},
			{name: 'Administrative',     render: this.renderStepAdministrative, optional: false, checkers: [this.checkAuthorName, this.checkAuthorGithub, this.checkAuthorEmail]},
			{name: 'Settings',           render: this.renderStepSettings,   optional: false},
			{name: 'Generate',           render: this.renderStepGenerate,   optional: false}
		];


		let activeStep = window.location.hash ? parseInt(window.location.hash.replace('#', ''), 10) : 0;

		if (activeStep < 0) {
			activeStep = 0;
		}

		if (activeStep >= this.steps.length) {
			activeStep = this.steps.length - 1;
		}

		this.state = {
            requesting: false,
            error: null,
            screenWidth: window.innerWidth,
			activeStep: activeStep,
			skipped: new Set(),
			checkIfExists: window.localStorage.getItem('checkIfExists') ? window.localStorage.getItem('checkIfExists') === 'true' : true,
			answers: {
				cli: false,
				adapterName: window.localStorage.getItem('adapterName') || '',
				title: window.localStorage.getItem('title') || '',
				description: window.localStorage.getItem('description') || '',
				features: window.localStorage.getItem('features') ? JSON.parse(window.localStorage.getItem('features')) : ['adapter'],
				adminFeatures: window.localStorage.getItem('adminFeatures') ? JSON.parse(window.localStorage.getItem('adminFeatures')) : [],
				type: window.localStorage.getItem('type') || '',
				startMode: window.localStorage.getItem('startMode') || 'daemon',
				language: window.localStorage.getItem('language') || 'JavaScript',
				tools: window.localStorage.getItem('tools') ? JSON.parse(window.localStorage.getItem('tools')) : [
					'ESLint',
					'type checking',
					'TSLint'
				],
				indentation: window.localStorage.getItem('indentation') || 'Space (4)',
				quotes: window.localStorage.getItem('quotes') || 'single',
				es6class: window.localStorage.getItem('es6class') || 'no',
				authorName: window.localStorage.getItem('authorName') || '',
				authorGithub: window.localStorage.getItem('authorGithub') || '',
				authorEmail: window.localStorage.getItem('authorEmail') || '',
				gitCommit: window.localStorage.getItem('gitCommit') || 'no',
				license: window.localStorage.getItem('license') || 'MIT License',
				connection: window.localStorage.getItem('connection') || 'no',

				icon: window.localStorage.getItem('icon') || 'data:image/png;base64,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',
				parameters: window.localStorage.getItem('parameters') ? JSON.parse(window.localStorage.getItem('parameters')) : [
					{name: 'option1', type: 'checkbox', title: 'option 1 description', def: true},
					{name: 'option2', type: 'number', title: 'option 2 description', def: 42}
					//{name: 'value', type: 'string', title: 'My value', options: [{text: 'option1', value: 1}]}, def: 'default text'}
				]
			}
        };

		this.updateWindowDimensionsBound = this.updateWindowDimensions.bind(this);
		this.onHashChangeBound = this.onHashChange.bind(this);
		this.adapterNames = [];
		Comm.getAdapterNames(names => this.adapterNames = names || []);
    }

    componentDidMount() {
		window.addEventListener('hashchange', this.onHashChangeBound, false);
        window.addEventListener('resize', this.updateWindowDimensionsBound, false);
    }

    componentWillUnmount() {
		window.removeEventListener('hashchange', this.onHashChangeBound, false);
		window.removeEventListener('resize', this.updateWindowDimensionsBound, false);
	}

	onHashChange() {
    	const activeStep = window.location.hash ? parseInt(window.location.hash.replace('#', ''), 10) : 0;
    	if (activeStep !== this.state.activeStep) {
    		if (activeStep >= 0 && activeStep < this.steps.length - 1) {
				this.setState({activeStep});
			}
		}
	}

    updateWindowDimensions() {
        this.setState({screenWidth: window.innerWidth});
    }

    onCreate() {
		this.setState({
			error: null,
			requesting: true
		});

        Comm.create(this.state.answers, (err, blob) => {
            if (err) {
                this.setState({
                    error: err,
                    requesting: false
                });
            } else {
                this.setState({
                    error: null,
                    requesting: false
                });

                if (blob) {
					const url = window.URL.createObjectURL(blob);
					const a = window.document.createElement('a');
					a.href = url;
					a.download = `ioBroker.${this.state.answers.adapterName}.zip`;
					// we need to append the element to the dom -> otherwise it will not work in firefox
					window.document.body.appendChild(a);
					a.click();
					a.remove();
				}
            }
        });
    }

    // returns true if adapter name is invalid
    checkAdapterName(text) {
    	text = text || this.state.answers.adapterName;
    	if (this.state.checkIfExists && this.adapterNames.indexOf(text.trim()) !== -1) {
    		return 'Adapter with such name yet exists!';
		}
		if (!text.trim()) {
			return 'Adapter name may not be empty';
		}
		return text.match(/[^-a-z0-9]/) ? "Only ASCII lowercase letters, digits, \"-\" and \"_\" are allowed" : false;
	}

	// returns true if adapter title is invalid
	checkTitle(title) {
		title = title || this.state.answers.title;
		if (!isNotEmpty(title)) {
			return 'Please enter a title!';
		}
		if (/iobroker|adapter/i.test(title)) {
			return `The title must not contain the words "ioBroker" or "adapter"!`;
		}
		return false;
	}

	// returns true if adapter name is invalid
	checkType(text) {
		text = text || this.state.answers.type;
		return !isNotEmpty(text);
	}

	// returns true if author name is invalid
	checkAuthorName(text) {
		text = text || this.state.answers.authorName;
		return !text;
	}

	// returns true if author github name is invalid
	checkAuthorGithub(text) {
		text = text || this.state.answers.authorGithub;
		return !text;
	}

	// returns true if author email name is invalid
	checkAuthorEmail(text) {
		text = text || this.state.answers.authorEmail;

		const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+@[-_a-z0-9]+\.[-_a-z0-9]+$/;
		return !re.test(text.toLowerCase());
	}

	updateAnswers(attr, value, _result, i) {
		if (typeof attr === 'string') {
			const parts = attr.split('.');
			_result = JSON.parse(JSON.stringify(this.state.answers));
			this.updateAnswers(parts, value, _result, 0);
			this.setState({answers: _result});
			window.localStorage.setItem(attr, typeof value === 'object' ? JSON.stringify(value): value.toString());
		} else {
			if (attr.length - 1 === i) {
				_result[attr[i]] = value;
			} else {
				this.updateAnswers(attr, value, _result[attr[i]], i + 1);
			}
		}
	}

	parseTypeText(text) {
    	const m = text.match(/\(([^)]+)/);
    	if (m) {
    		return [text.replace('(' + m[1] + ')', '').trim(), (<span className={this.props.classes.typeDesc}>{m[1]}</span>)]
		} else {
    		return text;
		}
	}

	renderType() {
		return (<FormControl className={this.props.classes.selectType + ' ' + this.props.classes.textInputs}>
			<InputLabel shrink htmlFor="age-label-placeholder">
				Type
			</InputLabel>
			<Select
				disabled={this.state.requesting}
				error={this.checkType()}
				value={this.state.answers.type}
				onChange={e => this.updateAnswers('type', e.target.value)}
			>
				(<MenuItem value="">Please select</MenuItem>)
				{ADAPTER_TYPES.map(type => (<MenuItem value={type.value}>{this.parseTypeText(type.message)}</MenuItem>))}
			</Select>
			<FormHelperText>Select adapter type</FormHelperText>
		</FormControl>);
	}

	static readFileDataUrl(file, cb) {
		const reader = new FileReader();
		reader.onload = () => {
			cb(null, {data: reader.result, name: file.name});
		};
		reader.onabort = () => {
			console.error('file reading was aborted');
			cb('file reading was aborted');
		};
		reader.onerror = (e) => {
			console.error('file reading has failed');
			cb('file reading has failed: ' + e);
		};

		reader.readAsDataURL(file)
	}

	handleDropImage(files, rejected) {
		if (files && files.hasOwnProperty('target')) {
			files = files.target.files;
		}

		if (!files && !files.length) {
			if (rejected && rejected.length) {
				alert('File is rejected. May be wrong format or too big > 300k.');
			}
			return;
		}
		const file = files[files.length - 1];

		if (!file) {
			return;
		}
		App.readFileDataUrl(file, (err, file) => {
			if (err) {
				alert(err);
			} else {
				this.updateAnswers('icon', typeof file === 'object' ? file.data : file)
			}
		});
	}

	renderStepNames() {
    	const titleError = this.checkTitle();
    	const nameError = this.checkAdapterName();

    	return [
			(<FormControlLabel
				className={this.props.classes.paddingTop}
				control={
					<Checkbox
						checked={this.state.checkIfExists}
						onChange={(e, checked) => {
							window.localStorage.setItem('checkIfExists', checked ? 'true' : 'false');
							this.setState({checkIfExists: checked});
						}}
					/>
				}
				label="Check if adapter with this name yet exists"
			/>),
			(<TextField
				error={!!nameError}
				disabled={this.state.requesting}
				label="Adapter name"
				className={this.props.classes.adapterName + ' ' + this.props.classes.textInputs}
				value={this.state.answers.adapterName}
				onChange={e => this.updateAnswers('adapterName', e.target.value)}
				helperText={nameError || "Only ASCII lowercase letters, digits, \"-\" and \"_\" are allowed"}
				margin="normal"
			/>),
			(<TextField
				error={!!titleError}
				disabled={this.state.requesting}
				label="Adapter title"
				className={this.props.classes.title + ' ' + this.props.classes.textInputs}
				value={this.state.answers.title}
				onChange={e => this.updateAnswers('title', e.target.value)}
				helperText={titleError || 'Write it in english. It will be automatically translated into other languages.'}
				margin="normal"
			/>),
			(<TextField
				label="Description"
				disabled={this.state.requesting}
				error={!isNotEmpty(this.state.answers.description)}
				className={this.props.classes.title + ' ' + this.props.classes.textInputs}
				value={this.state.answers.description}
				onChange={e => this.updateAnswers('description', e.target.value)}
				helperText={'Write it in english. It will be automatically translated into other languages.'}
				margin="normal"
			/>),
			this.renderType(),
			(<Dropzone
				className={this.props.classes.iconDrop}
				onDrop={(files, rejected) => this.handleDropImage(files, rejected)}
				maxSize={300000}
				accept={'image/jpeg, image/png'}
			>
				{({getRootProps, getInputProps, isDragActive}) => {
					return (
						<div
							{...getRootProps()}
							className={this.props.classes.iconDrop + ' dropzone' + (isDragActive ? ' dropzone--isActive' : '')}
						>
							<input {...getInputProps()} />
							{
								isDragActive ?
									(<p>Drop files here...</p>) :
									(<p>Try dropping some files here, or click to select files to upload.</p>)
							}
							{
								this.state.answers.icon ? (<img key={'image-preview'}
																className={this.props.classes.icon}
																src={typeof this.state.answers.icon === 'object' ? this.state.answers.icon.preview : this.state.answers.icon}
																alt={'icon'} style={{width: 'auto'}}/>) : null
							}
						</div>
					)
				}}
			</Dropzone>)
		];
	}

	renderStepProperties() {
    	const isAdapter = this.state.answers.features.indexOf('adapter') !== -1;
    	const isVis = this.state.answers.features.indexOf('vis') !== -1;
		return [
			// features / adapter
			(<FormControlLabel
				className={this.props.classes.paddingTop}
				control={
					<Checkbox
						checked={isAdapter}
						onChange={(e, checked) => {
							const name = 'adapter';
							const values = JSON.parse(JSON.stringify(this.state.answers.features));
							if (checked && values.indexOf(name) === -1) {
								values.push(name);
							} else if (!checked && values.indexOf(name) !== -1) {
								values.splice(values.indexOf(name), 1);
							}
							this.updateAnswers('features', values);
						}}
					/>
				}
				label="Include adapter code"
			/>),

			// features / vis
			(<FormControlLabel
				className={this.props.classes.paddingTop}
				control={
					<Checkbox
						checked={isVis}
						onChange={(e, checked) => {
							const name = 'vis';
							const values = JSON.parse(JSON.stringify(this.state.answers.features));
							if (checked && values.indexOf(name) === -1) {
								values.push(name);
							} else if (!checked && values.indexOf(name) !== -1) {
								values.splice(values.indexOf(name), 1);
							}
							this.updateAnswers('features', values);
						}}
					/>
				}
				label="Include visualization code (www)"
			/>),
			(<br/>),

			// startMode
			isAdapter ? (<FormControl className={this.props.classes.startMode + ' ' + this.props.classes.textInputs}>
				<InputLabel shrink>Running mode</InputLabel>
				<Select
					disabled={this.state.requesting}
					value={this.state.answers.startMode}
					onChange={e => this.updateAnswers('startMode', e.target.value)}
				>
					<MenuItem value="daemon">always (recommended for most adapters)</MenuItem>
					<MenuItem value="subscribe">when the ".alive" state is true</MenuItem>
					<MenuItem value="schedule">depending on a schedule</MenuItem>
					<MenuItem value="once">when the instance object changes</MenuItem>
					<MenuItem value="none">never</MenuItem>
				</Select>
			</FormControl>) : null,

			// language
			isAdapter ? (<FormControl className={this.props.classes.language + ' ' + this.props.classes.textInputs + ' ' + this.props.classes.paddingTop}>
				<InputLabel shrink>Language</InputLabel>
				<Select
					disabled={this.state.requesting}
					value={this.state.answers.language}
					onChange={e => this.updateAnswers('language', e.target.value)}
				>
					<MenuItem value="JavaScript">JavaScript</MenuItem>
					<MenuItem value="TypeScript">TypeScript</MenuItem>
				</Select>
			</FormControl>) : null,

			// quotes
			isAdapter ? (<FormControl className={this.props.classes.quotes + ' ' + this.props.classes.textInputs + ' ' + this.props.classes.paddingTop}>
				<InputLabel shrink>Double or single quotes</InputLabel>
				<Select
					disabled={this.state.requesting}
					value={this.state.answers.quotes}
					onChange={e => this.updateAnswers('quotes', e.target.value)}
				>
					<MenuItem value="single">'single'</MenuItem>
					<MenuItem value="double">"double"</MenuItem>
				</Select>
			</FormControl>) : null,

			// es6class
			isAdapter ? (<FormControl className={this.props.classes.es6class + ' ' + this.props.classes.textInputs + ' ' + this.props.classes.paddingTop}>
				<InputLabel shrink>How should the main adapter file be structured?</InputLabel>
				<Select
					disabled={this.state.requesting}
					value={this.state.answers.es6class}
					onChange={e => this.updateAnswers('es6class', e.target.value)}
				>
					<MenuItem value="yes">As an ES6 class (recommended)</MenuItem>
					<MenuItem value="no">With some methods (like legacy code)</MenuItem>
				</Select>
			</FormControl>) : null,

			// connection
			isAdapter ? (<FormControl className={this.props.classes.connection + ' ' + this.props.classes.textInputs + ' ' + this.props.classes.paddingTop}>
				<InputLabel shrink>Do you have connection indication to device or service?</InputLabel>
				<Select
					disabled={this.state.requesting}
					value={this.state.answers.connection}
					onChange={e => this.updateAnswers('connection', e.target.value)}
				>
					<MenuItem value="no">Do not create info.connection state</MenuItem>
					<MenuItem value="yes">Create info.connection state to indicate status in admin</MenuItem>
				</Select>
			</FormControl>) : null,

			// adminFeatures / tab
			isAdapter ? (<FormControlLabel
				className={this.props.classes.paddingTop}
				control={
					<Checkbox
						checked={this.state.answers.adminFeatures.indexOf('tab') !== -1}
						onChange={(e, checked) => {
							const name = 'tab';
							const values = JSON.parse(JSON.stringify(this.state.answers.adminFeatures));
							if (checked && values.indexOf(name) === -1) {
								values.push(name);
							} else if (!checked && values.indexOf(name) !== -1) {
								values.splice(values.indexOf(name), 1);
							}
							this.updateAnswers('adminFeatures', values);
						}}
					/>
				}
				label="An extra tab"
			/>) : null,

			// adminFeatures / custom
			isAdapter ? (<FormControlLabel
				className={this.props.classes.paddingTop}
				control={
					<Checkbox
						checked={this.state.answers.adminFeatures.indexOf('custom') !== -1}
						onChange={(e, checked) => {
							const name = 'custom';
							const values = JSON.parse(JSON.stringify(this.state.answers.adminFeatures));
							if (checked && values.indexOf(name) === -1) {
								values.push(name);
							} else if (!checked && values.indexOf(name) !== -1) {
								values.splice(values.indexOf(name), 1);
							}
							this.updateAnswers('adminFeatures', values);
						}}
					/>
				}
				label="Custom options for states"
			/>) : null,

			(<br/>),

			// tools / JavaScript / ESLint
			isAdapter && this.state.answers.language === 'JavaScript' ? (<FormControlLabel
				className={this.props.classes.paddingTop}
				control={
					<Checkbox
						checked={this.state.answers.tools.indexOf('ESLint') !== -1}
						onChange={(e, checked) => {
							const name = 'ESLint';
							const values = JSON.parse(JSON.stringify(this.state.answers.tools));
							if (checked && values.indexOf(name) === -1) {
								values.push(name);
							} else if (!checked && values.indexOf(name) !== -1) {
								values.splice(values.indexOf(name), 1);
							}
							this.updateAnswers('tools', values);
						}}
					/>
				}
				label="Use ESLint (recommended)"
			/>) : null,

			// tools / JavaScript / type checking
			isAdapter && this.state.answers.language === 'JavaScript' ? (<FormControlLabel
				className={this.props.classes.paddingTop}
				control={
					<Checkbox
						checked={this.state.answers.tools.indexOf('type checking') !== -1}
						onChange={(e, checked) => {
							const name = 'type checking';
							const values = JSON.parse(JSON.stringify(this.state.answers.tools));
							if (checked && values.indexOf(name) === -1) {
								values.push(name);
							} else if (!checked && values.indexOf(name) !== -1) {
								values.splice(values.indexOf(name), 1);
							}
							this.updateAnswers('tools', values);
						}}
					/>
				}
				label="Use type checking (recommended)"
			/>) : null,

			isAdapter && this.state.answers.language === 'JavaScript' ? (<br/>) : null,

			// tools / TypeScript / TSLint
			isAdapter && this.state.answers.language === 'TypeScript' ? (<FormControlLabel
				className={this.props.classes.paddingTop}
				control={
					<Checkbox
						checked={this.state.answers.tools.indexOf('TSLint') !== -1}
						onChange={(e, checked) => {
							const name = 'TSLint';
							const values = JSON.parse(JSON.stringify(this.state.answers.tools));
							if (checked && values.indexOf(name) === -1) {
								values.push(name);
							} else if (!checked && values.indexOf(name) !== -1) {
								values.splice(values.indexOf(name), 1);
							}
							this.updateAnswers('tools', values);
						}}
					/>
				}
				label="Use TSLint (recommended)"
			/>) : null,

			// tools / TypeScript / code coverage
			isAdapter && this.state.answers.language === 'TypeScript' ? (<FormControlLabel
				className={this.props.classes.paddingTop}
				control={
					<Checkbox
						checked={this.state.answers.tools.indexOf('code coverage') !== -1}
						onChange={(e, checked) => {
							const name = 'code coverage';
							const values = JSON.parse(JSON.stringify(this.state.answers.tools));
							if (checked && values.indexOf(name) === -1) {
								values.push(name);
							} else if (!checked && values.indexOf(name) !== -1) {
								values.splice(values.indexOf(name), 1);
							}
							this.updateAnswers('tools', values);
						}}
					/>
				}
				label="Use code coverage"
			/>) : null,

			isAdapter && this.state.answers.language === 'TypeScript' ? (<br/>) : null,
		];
	}

	renderStepAdministrative() {
		return [
			(<TextField
				error={this.checkAuthorName()}
				disabled={this.state.requesting}
				label="Please enter your name (or nickname)"
				className={this.props.classes.authorName + ' ' + this.props.classes.textInputs}
				value={this.state.answers.authorName}
				onChange={e => this.updateAnswers('authorName', e.target.value)}
				helperText={"Enter here the name of author"}
				margin="normal"
			/>),
			(<TextField
				error={this.checkAuthorGithub()}
				disabled={this.state.requesting}
				label="What's your name/org on GitHub?"
				className={this.props.classes.authorGithub + ' ' + this.props.classes.textInputs}
				value={this.state.answers.authorGithub}
				onChange={e => this.updateAnswers('authorGithub', e.target.value)}
				helperText={"Enter here the name of author on github"}
				margin="normal"
			/>),
			(<TextField
				error={this.checkAuthorEmail()}
				disabled={this.state.requesting}
				label="What's your email address?"
				className={this.props.classes.authorEmail + ' ' + this.props.classes.textInputs}
				value={this.state.answers.authorEmail}
				onChange={e => this.updateAnswers('authorEmail', e.target.value)}
				margin="normal"
			/>),
			(<FormControl className={this.props.classes.es6class + ' ' + this.props.classes.textInputs + ' ' + this.props.classes.paddingTop}>
				<InputLabel shrink>License</InputLabel>
				<Select
					disabled={this.state.requesting}
					value={this.state.answers.license}
					onChange={e => this.updateAnswers('license', e.target.value)}
				>
					<MenuItem value="MIT License">MIT License</MenuItem>
					<MenuItem value="GNU AGPLv3">GNU AGPLv3</MenuItem>
					<MenuItem value="GNU GPLv3">GNU GPLv3</MenuItem>
					<MenuItem value="GNU LGPLv3">GNU LGPLv3</MenuItem>
					<MenuItem value="Mozilla Public License 2.0">Mozilla Public License 2.0</MenuItem>
					<MenuItem value="Apache License 2.0">Apache License 2.0</MenuItem>
					<MenuItem value="The Unlicense">The Unlicense</MenuItem>
				</Select>
			</FormControl>)
		];
	}

	getUniqueParamName() {
    	let i = 1;
    	while (this.state.answers.parameters.find(param => param.name === 'option' + i)) i++;
    	return 'option' + i;
	}

	onAddParam() {
    	const answers = JSON.parse(JSON.stringify(this.state.answers));
    	const name = this.getUniqueParamName();

		answers.parameters.push({
			name: name,
			type: 'string',
			title: name + ' description',
			def: 'default'
		});

		this.setState({answers});
	}

	onAddOption(i) {
		const answers = JSON.parse(JSON.stringify(this.state.answers));

		answers.parameters[i].options = answers.parameters[i].options || [];

		answers.parameters[i].options.push({
			text: 'text',
			value: 'value'
		});

		this.setState({answers});
	}

	onParamChange(i, attr, value) {
		const answers = JSON.parse(JSON.stringify(this.state.answers));
		answers.parameters[i][attr] = value;
		if (attr === 'type') {
			if (value === 'text' && typeof answers.parameters[i].def !== 'string') {
				answers.parameters[i].def = 'default';
			} else if (value === 'number' && typeof answers.parameters[i].def !== 'number') {
				answers.parameters[i].def = 0;
			} else if (value === 'checkbox' && typeof answers.parameters[i].def !== 'boolean') {
				answers.parameters[i].def = false;
			} else if (value === 'select') {
				if (typeof answers.parameters[i].def !== 'string') {
					answers.parameters[i].def = '1';
				}
				answers.parameters[i].options = answers.parameters[i].options || [{text: 'value1', value: '1'}];
			}
		}

		this.setState({answers});
		window.localStorage.setItem('parameters', JSON.stringify(answers.parameters));
	}

	onOptionChange(i, j, attr, value) {
		const answers = JSON.parse(JSON.stringify(this.state.answers));
		answers.parameters[i].options[j][attr] = value;

		this.setState({answers});
		window.localStorage.setItem('parameters', JSON.stringify(answers.parameters));
	}

	onDeleteOption(i, j) {
		const answers = JSON.parse(JSON.stringify(this.state.answers));
		answers.parameters[i].options.splice(j, 1);
		this.setState({answers});
		window.localStorage.setItem('parameters', JSON.stringify(answers.parameters));
	}

	renderOptions(param, i) {
    	param.options = param.options || [];
		return [
			(<div style={{width: '100%', background: 'lightgray'}}>
				<div className={this.props.classes.optionsText}>Title</div>
				<div className={this.props.classes.optionsValue}>Value</div>
				<IconButton className={this.props.classes.buttonAdd}
						 style={{color: 'green'}}
						 onClick={() => this.onAddOption(i)}>
					<AddIcon fontSize="small" />
				</IconButton>
			</div>),
			(<br/>),
			param.options.map((option, j) =>
				[
					(<Input
						className={this.props.classes.optionsText}
						style={{fontWeight: 'normal'}}
						value={option.text}
						onChange={e => this.onOptionChange(i, j, 'text', e.target.value) }
					/>),
					(<Input
						className={this.props.classes.optionsValue}
						style={{fontWeight: 'normal'}}
						value={option.value}
						onChange={e => this.onOptionChange(i, j, 'value', e.target.value) }
					/>),
					(<IconButton className={this.props.classes.optionsButtonDel}
								 style={{color: 'red'}}
								 onClick={() => this.onDeleteOption(i, j)}>
							<DeleteIcon fontSize="small" />
					</IconButton>),
					(<br/>)
				]
			)
		];
	}

	onDeleteParam(i) {
		const answers = JSON.parse(JSON.stringify(this.state.answers));
		answers.parameters.splice(i, 1);
		this.setState({answers});
		window.localStorage.setItem('parameters', JSON.stringify(answers.parameters));
	}

	renderOneParam(param, i) {
		return (<TableRow key={i} className={this.props.classes.tableRow}>
			<TableCell scope="row" className={this.props.classes.paramsName}>
				<Input
					className={this.props.classes.paramsNameInput}
					value={param.name}
					onChange={e => this.onParamChange(i, 'name', e.target.value) }
				/>
			</TableCell>
			<TableCell className={this.props.classes.paramsTitle}>
				<Input
					className={this.props.classes.paramsTitleInput}
					value={param.title}
					onChange={e => this.onParamChange(i, 'title', e.target.value) }
				/>
			</TableCell>
			<TableCell className={this.props.classes.paramsType}>
				<Select
					className={this.props.classes.paramsTypeSelect}
					value={param.type}
					onChange={e => this.onParamChange(i, 'type', e.target.value)}
				>
					<MenuItem value="text">string</MenuItem>
					<MenuItem value="number">number</MenuItem>
					<MenuItem value="checkbox">boolean</MenuItem>
					<MenuItem value="select">select</MenuItem>
				</Select>
			</TableCell>
			<TableCell className={this.props.classes.paramsOptions}>
				{param.type === 'select' ? this.renderOptions(param, i) : '-'}
			</TableCell>
			<TableCell className={this.props.classes.paramsDef}>
				{param.type === 'text' ? (<Input
					className={this.props.classes.paramsDefInput}
					value={param.def}
					onChange={e => this.onParamChange(i, 'def', e.target.value) }
				/>) : null}
				{param.type === 'checkbox' ? (<Checkbox
					checked={param.def}
					onChange={(e, value) => this.onParamChange(i, 'def', value) }
				/>) : null}
				{param.type === 'number' ? (<Input
					className={this.props.classes.paramsDefInput}
					type="number"
					value={param.def}
					onChange={e => this.onParamChange(i, 'def', e.target.value) }
				/>) : null}
				{param.type === 'select' ? (<Select
					className={this.props.classes.paramsDefInput}
					value={param.def}
					onChange={e => this.onParamChange(i, 'def', e.target.value) }
				>
					{param.options.map(opt => (<MenuItem value={opt.value}>{opt.text}</MenuItem>))}
				</Select>) : null}
			</TableCell>
			<TableCell className={this.props.classes.paramsButtons}>
				<Fab className={this.props.classes.buttonDel} size="small" color="primary" onClick={() => this.onDeleteParam(i)} aria-label="Delete"><DeleteIcon /></Fab>
			</TableCell>
		</TableRow>);
	}

	renderStepSettings() {
		return [
			(<Fab className={this.props.classes.buttonAdd} size="small" color="secondary" onClick={() => this.onAddParam()} aria-label="Check"><AddIcon /></Fab>),
			(<Paper className={this.props.classes.rootTable}>
				<Table className={this.props.classes.table}>
					<TableHead>
						<TableRow>
							<TableCell className={this.props.classes.paramsName}>Name</TableCell>
							<TableCell className={this.props.classes.paramsTitle}>Title</TableCell>
							<TableCell className={this.props.classes.paramsType}>Type</TableCell>
							<TableCell className={this.props.classes.paramsOptions}>Options</TableCell>
							<TableCell className={this.props.classes.paramsDef}>Default value</TableCell>
							<TableCell className={this.props.classes.paramsButtons}>Default value</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.state.answers.parameters.map((param, i) => this.renderOneParam(param, i))}
					</TableBody>
				</Table>
			</Paper>)
		];
	}

	renderStepGenerate() {
		return [
			(<p>You are ready to generate the template.</p>),
			<ExpansionPanel>
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<p>Send data</p>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<pre>{JSON.stringify(this.state.answers, null, 2)}</pre>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		];
	}

	checkStepNames() {
		return true;
	}

	checkStepProperties() {
		return true;
	}

	checkStepSettings() {
		return true;
	}

	getSteps() {
		return this.steps.map(page => page.name);
	}

	isStepOptional(index) {
		return this.steps[index].optional;
	}



	handleNext() {
		const { activeStep } = this.state;
		let { skipped } = this.state;
		if (this.isStepSkipped(activeStep)) {
			skipped = new Set(skipped.values());
			skipped.delete(activeStep);
		}
		window.history.pushState(null, null, '#' + (activeStep + 1));
		this.setState({
			activeStep: activeStep + 1,
			skipped,
		});
	};

	handleBack() {
		window.history.pushState(null, null, '#' + (this.state.activeStep - 1));
		this.setState(state => ({
			activeStep: state.activeStep - 1,
		}));
	};

	handleSkip() {
		const { activeStep } = this.state;
		if (!this.isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}

		window.history.pushState(null, null, '#' + (this.state.activeStep + 1));

		this.setState(state => {
			const skipped = new Set(state.skipped.values());
			skipped.add(activeStep);
			return {
				activeStep: state.activeStep + 1,
				skipped,
			};
		});
	};

	handleReset() {
		window.history.pushState(null, null, '#0');
		this.setState({activeStep: 0});
	};

	isStepSkipped(step) {
		return this.state.skipped.has(step);
	}

	getStepContent(step) {
		return this.steps[step].render.call(this);
	}

	renderNextButton(steps) {
		if (this.state.activeStep === steps.length - 1) {
			return this.state.requesting ?
				(<CircularProgress className={this.props.classes.buttonCheck} color="secondary" />) :
				(<Fab className={this.props.classes.buttonCheck} size="small" color="secondary" variant="extended" onClick={() => this.onCreate()} aria-label="Check"><CheckIcon />Generate</Fab>);
		} else {
			const isEnabled = this.steps[this.state.activeStep].checkers ?
				!this.steps[this.state.activeStep].checkers.find(checker =>
					checker.call(this)) :
				true;

			return (<Button
				variant="contained"
				color="primary"
				disabled={!isEnabled}
				onClick={() => this.handleNext()}
				className={this.props.classes.button}
			>
				Next
			</Button>)
		}
	}

	render() {
		const steps = this.getSteps();

        return (
            <div className={this.props.classes.body}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        {this.state.screenWidth > NARROW_WIDTH ? (<h4 className={this.props.classes.toolbarTitle}>Adapter creator</h4>) : null}
                    </Toolbar>
                </AppBar>
				<Stepper activeStep={this.state.activeStep}>
					{steps.map((label, index) => {
						const props = {};
						const labelProps = {};
						if (this.isStepOptional(index)) {
							labelProps.optional = <caption className={this.props.classes.optional}>Optional</caption>;
						}
						if (this.isStepSkipped(index)) {
							props.completed = false;
						}
						return (
							<Step key={label} {...props}>
								<StepLabel {...labelProps}>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				<div className={this.props.classes.page}>
					<div>
						<p className={this.props.classes.instructions}>{this.getStepContent(this.state.activeStep)}</p>
						<div>
							<Button
								disabled={this.state.activeStep === 0 || this.state.requesting}
								onClick={() => this.handleBack()}
								className={this.props.classes.button}
							>
								Back
							</Button>
							{this.isStepOptional(this.state.activeStep) && (
								<Button
									disabled={this.state.requesting}
									variant="contained"
									color="primary"
									onClick={() => this.handleSkip()}
									className={this.props.classes.button}
								>
									Skip
								</Button>
							)}
							{this.renderNextButton(steps)}

						</div>
					</div>
				</div>
            </div>
        );
    }
}

export default withStyles(styles)(App);
