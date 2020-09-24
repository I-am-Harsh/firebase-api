var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/upload', uploadRouter);

module.exports = app;


// simple code
// const {Storage} = require('@google-cloud/storage');
// const express = require("express");

// const app = new express();


// const storage = new Storage({
//     keyFilename: "image-api-91bce-firebase-adminsdk-ldyiw-c1ca6e58c2.json"
//  });

// let bucketName = "image-api-91bce.appspot.com"

// let filename = 'package.json';

// // Testing out upload of file
// const uploadFile = async() => {

//     // Uploads a local file to the bucket
//     await storage.bucket(bucketName).upload(`${filename}`, {
//         // Support for HTTP requests made with `Accept-Encoding: gzip`
//         gzip: true,
//         // By setting the option `destination`, you can change the name of the
//         // object you are uploading to a bucket.
//         metadata: {
//             // Enable long-lived HTTP caching headers
//             // Use only if the contents of the file will never change
//             // (If the contents will change, use cacheControl: 'no-cache')
//             cacheControl: 'public, max-age=31536000',
//         },
// });

// console.log(`${filename} uploaded to ${bucketName}.`);
// }

// uploadFile();

// app.listen(process.env.PORT || 8088, () => { console.log('node server running');})
