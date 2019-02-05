const fs = require('fs');
const archiver = require('archiver');
const { createFiles, writeFiles } = require('./src/lib/createAdapter');
const questions = require('./src/lib/questions');

/** Where the output should be written */
const rootDirName = '/tmp';

function deleteFolderRecursive(dirPath, _notRoot) {
	if (fs.existsSync(dirPath)) {
		fs.readdirSync(dirPath).forEach((file, index) => {
			const curPath = dirPath + '/' + file;
			if (fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath, true);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		_notRoot && fs.rmdirSync(dirPath);
	}
}

function pack(adapterName) {
	return new Promise((resolve, reject) => {
		// create a file to stream archive data to.
		const output = fs.createWriteStream(`${rootDirName}/ioBroker.${adapterName}.zip`);
		const archive = archiver('zip', {
			zlib: { level: 9 } // Sets the compression level.
		});

		// listen for all archive data to be written
		// 'close' event is fired only when a file descriptor is involved
		output.on('close', () => {
			resolve(`${rootDirName}/ioBroker.${adapterName}.zip`);
		});

		// This event is fired when the data source is drained no matter what was the data source.
		// It is not part of this library but rather from the NodeJS Stream API.
		// @see: https://nodejs.org/api/stream.html#stream_event_end
		output.on('end', () => console.log('Data has been drained'));

		// good practice to catch warnings (ie stat failures and other non-blocking errors)
		archive.on('warning', err => {
			if (err.code === 'ENOENT') {
				// log warning
				console.warn(err);
			} else {
				// throw error
				reject(err);
			}
		});

		// good practice to catch this error explicitly
		archive.on('error', err =>
			reject(err));

		// pipe archive data to the file
		archive.pipe(output);

		// append files from a glob pattern
		archive.directory(`${rootDirName}/ioBroker.${adapterName}/`, false);

		// finalize the archive (ie we are done appending files but streams have to finish yet)
		// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
		archive.finalize();
	});
}

exports.handler = async (event) => {
	// console.log(JSON.stringify(event));

	let answers = JSON.parse(event.body);

	console.log('ANSWERS: ' + JSON.stringify(answers, null, 2));

	if (!fs.existsSync(rootDirName)) {
		fs.mkdirSync(rootDirName);
	} else {
		// clean dir
		deleteFolderRecursive(rootDirName);
		if (!fs.existsSync(rootDirName)) {
			fs.mkdirSync(rootDirName);
		}
	}
	// Check all answers
	questions.checkAnswers(answers);
	answers = await questions.formatAnswers(answers);
	await questions.validateAnswers(answers, []);

	// Create adapter directory
	if (!fs.existsSync(`${rootDirName}/ioBroker.${answers.adapterName}`)) {
		fs.mkdirSync(`${rootDirName}/ioBroker.${answers.adapterName}`);
	}

	// create files
	const files = await createFiles(answers);
	await writeFiles(rootDirName + '/' + `ioBroker.${answers.adapterName}`, files);

	// pack the directory together
	const fileName = await pack(answers.adapterName);

	const base64 = fs.readFileSync(fileName).toString('base64');

	deleteFolderRecursive(rootDirName);

	return {
		statusCode: 200,
		headers: {
			'Content-Disposition': `attachment; filename="ioBroker.${answers.adapterName}.zip"`,
			'Content-Type': 'application/zip',
			'Access-Control-Allow-Origin': '*', // Required for CORS support to work
			'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
		},
		body: base64,
		isBase64Encoded: true
	};
};
