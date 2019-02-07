const fs = require("fs");
const archiver = require("archiver");

const rootDirName = __dirname;

function pack() {
	return new Promise((resolve, reject) => {
		// create a file to stream archive data to.
		const output = fs.createWriteStream(`${rootDirName}/lambda.zip`);
		const archive = archiver("zip", {
			zlib: { level: 9 } // Sets the compression level.
		});

		// listen for all archive data to be written
		// "close" event is fired only when a file descriptor is involved
		output.on("close", () => {
			resolve(`${rootDirName}/lambda.zip`);
		});

		// This event is fired when the data source is drained no matter what was the data source.
		// It is not part of this library but rather from the NodeJS Stream API.
		// @see: https://nodejs.org/api/stream.html#stream_event_end
		output.on("end", () => console.log("Data has been drained"));

		// good practice to catch warnings (ie stat failures and other non-blocking errors)
		archive.on("warning", err => {
			if (err.code === "ENOENT") {
				// log warning
				console.warn(err);
			} else {
				// throw error
				reject(err);
			}
		});

		// good practice to catch this error explicitly
		archive.on("error", err =>
			reject(err));

		// pipe archive data to the file
		archive.pipe(output);

		// append files from a glob pattern
		archive.directory(rootDirName + '/node_modules/', 'node_modules');
		archive.directory(rootDirName + '/src/', 'src');
		archive.directory(rootDirName + '/templates/', 'templates');
		archive.file(rootDirName + '/index.js', {name: 'index.js'});
		archive.file(rootDirName + '/adapter-creator.png', {name: 'adapter-creator.png'});

		// finalize the archive (ie we are done appending files but streams have to finish yet)
		// "close", "end" or "finish" may be fired right after calling this method so register to them beforehand
		archive.finalize();
	});
}

pack();
