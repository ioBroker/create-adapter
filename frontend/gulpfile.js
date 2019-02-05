const AWS = require('aws-sdk');
const fs = require('fs');
if (fs.existsSync(__dirname + '/config.json')) {
    AWS.config.loadFromPath(__dirname + '/config.json');
}
const s3 = new AWS.S3();
const gulp = require('gulp');
const exec = require('gulp-exec');
const mime = require('mime');

const BUCKET_NAME = process.env.AWS_BACKET_NAME || 'adaptercreator';
const SRC = '../frontend';
const distributionId = process.env.AWS_DISTRIBUTION_ID || '';

function uploadOneFile(root, fileName, cb) {
    // Read in the file, convert it to base64, store to S3
    fs.readFile(root + fileName, (err, data) => {
        if (err) { throw err; }
        const base64data = new Buffer(data, 'binary');

        s3.putObject({
            Bucket: BUCKET_NAME,
            ContentType: typeof mime.lookup === 'function' ? mime.lookup(fileName) : mime.getType(fileName),
            Key: fileName.replace(/^\//, ''),
            Body: base64data
        }, (err, obj) => {
            cb(err);
            console.log(`${fileName} done: ${obj && obj.ETag}`);
        });
    });
}

function uploadFiles(root, files, cb) {
    if (!files || !files.length) {
        cb && cb();
    } else {
        const file = files.pop();
        uploadOneFile(root, file, () =>
            setImmediate(uploadFiles, root, files, cb));
    }
}

function uploadRecursive(root, subRoot, cb) {
    subRoot = subRoot || '/';
    const files = fs.readdirSync(root + subRoot);
    const uFiles = [];
    files.forEach(file => {
        const stat = fs.statSync(root + subRoot + file);
        if (stat.isDirectory()) {
            uploadRecursive(root, subRoot + file + '/');
        } else {
            uFiles.push(subRoot + file);
        }
    });
    uploadFiles(root, uFiles, cb);
}

function deleteFiles(cb) {
    const params = {
        Bucket: BUCKET_NAME,
        MaxKeys: 30
    };
    s3.listObjects(params, (err, data) => {
        if (err) {
            cb(err);
        } else {
            const params = {
                Bucket: BUCKET_NAME,
                Delete: {
                    Objects: [
                        {
                            Key: "objectkey1"
                        },
                        {
                            Key: "objectkey2"
                        }
                    ],
                    Quiet: false
                }
            };
            params.Delete.Objects = data.Contents.map(file => {
                return {Key: file.Key};
            });
            if (!data.Contents.length) {
                cb(null, 'done');
            } else {
                s3.deleteObjects(params, (err, data) => {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, data);
                    }
                });
            }
        }
    });
}

function build() {
    const options = {
        continueOnError:        false, // default = false, true means don't emit error event
        pipeStdout:             false, // default = false, true means stdout is written to file.contents
        customTemplatingThing:  'build', // content passed to gutil.template()
        cwd:                    __dirname + '/' + SRC + '/'
    };
    const reportOptions = {
        err:    true, // default = true, false means don't write err
        stderr: true, // default = true, false means don't write stderr
        stdout: true  // default = true, false means don't write stdout
    };

    console.log(options.cwd);

    if (fs.existsSync(__dirname + '/' + SRC + '/node_modules/react-scripts/scripts/build.js')) {
        return gulp.src(__dirname + '/' + SRC + '/node_modules/react-scripts/scripts/build.js')
            .pipe(exec('node <%= file.path %>', options))
            .pipe(exec.reporter(reportOptions));
    } else {
        return gulp.src(__dirname + '/node_modules/react-scripts/scripts/build.js')
            .pipe(exec('node <%= file.path %>', options))
            .pipe(exec.reporter(reportOptions));

    }
}

gulp.task('build', () => build());

gulp.task('delete', gulp.parallel('build', done => {
    deleteFiles(done);
}));

gulp.task('upload', gulp.series('delete', done => {
    uploadRecursive(__dirname + '/' + SRC + '/build', null, done);
}));

gulp.task('invalidate', () => {
    return new Promise((resolve, reject) => {
        const invalidateList = ['/*'];
        const callerReference = Date.now().toString();
        const cloudfront = new AWS.CloudFront();
        cloudfront.createInvalidation({
            DistributionId: distributionId,
            InvalidationBatch: {
                CallerReference: callerReference,
                Paths: {
                    Quantity: ['/*'].length,
                    Items: invalidateList
                }
            }
        }, (err, data) => {
            if (err) {
                reject(err);
            }  else {
                resolve(data)
            }
        });
    });
});

gulp.task('default', gulp.series('upload', 'invalidate'));

// call
// aws cloudfront create-invalidation --distribution-id E1WDGDGE5KN2NG --paths "/*"
// after upload
