import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import Comm from './Comm';

import CheckIcon from '@material-ui/icons/DoneOutlined';
import ErrorIcon from '@material-ui/icons/Cancel';
import WarningIcon from '@material-ui/icons/Announcement';

const NARROW_WIDTH = 500;

const styles = theme => ({
    toolbarTitle: {
        position: 'absolute',
        top: 0,
        right: 20
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
    	padding: 20
	},
	typeDesc: {
		fontSize: 10,
		fontStyle: 'italic',
		paddingLeft: 10
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
        this.state = {
            requesting: false,
            error: null,
            screenWidth: window.innerWidth,
			step: 0,
			answers: {
				"cli": false,
				"adapterName": window.localStorage.getItem('adapterName') || "adaptername",
				"title": window.localStorage.getItem('title') || "My Tests",
				"description": window.localStorage.getItem('description') || "User tries to test adapter creator",
				"features": window.localStorage.getItem('features') ? JSON.parse(window.localStorage.getItem('features')) : ["adapter"],
				"adminFeatures": window.localStorage.getItem('adminFeatures') ? JSON.parse(window.localStorage.getItem('adminFeatures')) : [],
				"type": window.localStorage.getItem('type') || '',
				"startMode": window.localStorage.getItem('startMode') || "daemon",
				"language": window.localStorage.getItem('language') || "JavaScript",
				"tools": window.localStorage.getItem('tools') ? JSON.parse(window.localStorage.getItem('tools')) : [
					"ESLint",
					"type checking"
				],
				"indentation": window.localStorage.getItem('indentation') || "Space (4)",
				"quotes": window.localStorage.getItem('quotes') || "single",
				"es6class": window.localStorage.getItem('es6class') || "no",
				"authorName": window.localStorage.getItem('authorName') || "Bluefox",
				"authorGithub": window.localStorage.getItem('authorGithub') || "GermanBluefox",
				"authorEmail": window.localStorage.getItem('authorEmail') || "dogafox@gmail.com",
				"gitCommit": window.localStorage.getItem('gitCommit') || "no",
				"license": window.localStorage.getItem('license') || "MIT License"
			}
        };

        this.checkers = [
        	this.checkTitle,
        	this.checkAdapterName,
        	this.checkType,

		];

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions());
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions)
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
		return !!text.match(/[^-a-z0-9]/);
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

	checkAllValid() {
    	return !this.checkers.find(func => func.call(this));
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

    renderStep0() {
    	const titleError = this.checkTitle();

    	return [
			(<TextField
				error={this.checkAdapterName()}
				disabled={this.state.requesting}
				label="Adapter name"
				className={this.props.classes.adapterName + ' ' + this.props.classes.textInputs}
				value={this.state.answers.adapterName}
				onChange={e => this.updateAnswers('adapterName', e.target.value)}
				helperText={"Only ASCII lowercase letters, digits, \"-\" and \"_\" are allowed"}
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
			this.renderType()
		];
	}

    render() {
        return (
            <div className={this.props.classes.body}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        {this.state.screenWidth > NARROW_WIDTH ? (<h4 className={this.props.classes.toolbarTitle}>Adapter creator</h4>) : null}
                        {
                            this.state.requesting ?
                                (<CircularProgress className={this.props.classes.buttonCheck} color="secondary" />) :
                                (<Fab className={this.props.classes.buttonCheck} size="small" color="secondary" variant="extended"  disabled={!this.checkAllValid()} onClick={() => this.onCreate()} aria-label="Check"><CheckIcon />Generate</Fab>)
                        }
                    </Toolbar>
                </AppBar>
                <div className={this.props.classes.page}>
					{this.state.step === 0 ? this.renderStep0() : null}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(App);
