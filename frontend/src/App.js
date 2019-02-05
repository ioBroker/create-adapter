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
        width: 'calc(100% - 40px)'
    },
    buttonCheck: {
        marginLeft: 10,
        marginRight: 20,
    },
	page: {
    	padding: 20
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
				"adapterName": "adaptername",
				"title": "My Tests",
				"description": "User tries to test adapter creator",
				"features": [
					"adapter"
				],
				"adminFeatures": [],
				"type": "date-and-time",
				"startMode": "daemon",
				"language": "JavaScript",
				"tools": [
					"ESLint",
					"type checking"
				],
				"indentation": "Space (4)",
				"quotes": "single",
				"es6class": "no",
				"authorName": "Bluefox",
				"authorGithub": "GermanBluefox",
				"authorEmail": "dogafox@gmail.com",
				"gitCommit": "no",
				"license": {
					"id": "MIT",
					"name": "MIT License",
					"text":
						"MIT License\n\nCopyright (c) [year] [fullname]\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FORA PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n"
				}
			}
        };

        this.checkers = [
        	this.checkTitle,
        	this.checkAdapterName,
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

	checkAllValid() {
    	return !this.checkers.find(func => !func.call(this));
	}

	updateAnswers(attr, value, _result, i) {
		if (typeof attr === 'string') {
			const parts = attr.split('.');
			_result = JSON.parse(JSON.stringify(this.state.answers));
			this.updateAnswers(parts, value, _result, 0);
			this.setState({answers: _result});
		} else {
			if (attr.length - 1 === i) {
				_result[attr[i]] = value;
			} else {
				this.updateAnswers(attr, value, _result[attr[i]], i + 1);
			}
		}
	}

	renderType() {
		return (<Select
			value={this.state.answers.type}
			onChange={e => this.updateAnswers('type', e.target.value)}
		>
			{ADAPTER_TYPES.map(type => (<MenuItem value={type.value}>{type.message}</MenuItem>))}
		</Select>);
	}

    renderStep0() {
    	const titleError = this.checkTitle();

    	return [
			(<TextField
				error={!this.checkAdapterName()}
				label="Adapter name"
				className={this.props.classes.adapterName + ' ' + this.props.classes.textInputs}
				value={this.state.answers.adapterName}
				onChange={e => this.updateAnswers('adapterName', e.target.value)}
				helperText={"Only ASCII lowercase letters, digits, \"-\" and \"_\" are allowed"}
				margin="normal"
			/>),
			(<TextField
				error={!!titleError}
				label="Adapter title"
				className={this.props.classes.title + ' ' + this.props.classes.textInputs}
				value={this.state.answers.title}
				onChange={e => this.updateAnswers('title', e.target.value)}
				helperText={titleError || 'Write it in english. It will be automatically translated into other languages.'}
				margin="normal"
			/>),
			(<TextField
				label="Description"
				error={isNotEmpty(this.state.answers.description)}
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
                                (<Fab className={this.props.classes.buttonCheck} size="small" color="secondary" disabled={!this.checkAllValid()} onClick={() => this.onCreate()} aria-label="Check"><CheckIcon /></Fab>)
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
