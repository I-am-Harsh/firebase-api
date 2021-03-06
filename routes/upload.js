const {Storage} = require('@google-cloud/storage');
const Multer = require('multer');
var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
// const buffer = require('buffer');

// const keyPath = path.join(`${__dirname}/keyFileName.json`);
// fs.writeFileSync(keyPath , process.env.key);


// initialize storage
// keyPath = undefined ||
const storage = new Storage({
    // keyFilename: keyPath,
    keyFilename : process.env.keyFileName,
    projectId: process.env.projectId
});
// const storage = new Storage();

const bucket = storage.bucket(process.env.bucket);

// multer
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fieldSize: 10 * 1024 * 1024, // no larger than 5mb, you can change as needed.
        fileSize : 25 * 1024 * 1024
    }
});




// route
router

// ejs get
.get('/', (req, res) => {
	res.render('upload', { 
        home : "nav-link",
        upload : "nav-link active", 
        alert : false,
        url : undefined
    })
})

.post('/', multer.single('image'), (req, res) => {
    let file = req.file;
    const public = req.body.public || true;
    // parse json
    if(!req.file){
        file = JSON.parse(req.body.image);

        // get buffer
        var buffer = new Buffer.from(file.buffer.data);
        
        //add buffer
        file.buffer = buffer;
    }

    // upload if file
	if (file) {	
		uploadImageToStorage(file, public)
		.then((result => {
            console.log("URL : ",result);
			res.status(200).json({ success : true, err : false, url : result})
		}))
		.catch(err => res.status(500).json({success : false, err : err, url : null}));
    }
})

// direct endpoint upload

.post(/raw, multer.single('image'), (req, res) => {
      let file = req.filel
      const public = req.body.public || true;
      
      if(file){
			uploadImageToStorage(file, public)
		.then((result => {
            console.log("URL : ",result);
			res.status(200).json({ success : true, err : false, url : result})
		}))
		.catch(err => res.status(500).json({success : false, err : err, url : null}));

	}
}

// ejs post
.post('/server', multer.single('image'), (req, res, next) => {
    const file = req.file;
    const public = req.body.public || true;
    console.log(file);
	if (file) {	
		uploadImageToStorage(file, public)
		.then((result => {
            res.render('upload', { 
                home : "nav-link", 
                upload : "nav-link active", 
                alert : true,
                url : result
            })
		}))
		.catch(err => next(err));
    }
    else{
        res.render('upload', { home : "nav-link", upload : "nav-link active", alert : true})
    }
})


const uploadImageToStorage = (file, public) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        let newFileName = `${Date.now()}_${file.originalname}`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
		});
		

        blobStream.on('error', (error) => {
			// console.log(error);
			reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
            if(public){
                bucket.file(newFileName).makePublic()
                .then(result => {
                    resolve(url);
                })
                .catch(err => console.log('Error : ',err));
            }
            else{
                resolve(url);
            }
        });

        blobStream.end(file.buffer);
    });
}


module.exports = router;
