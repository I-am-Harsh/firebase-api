const {Storage} = require('@google-cloud/storage');
const Multer = require('multer');
var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');

const keyPath = path.join(`${__dirname}/keyFileName.json`);
fs.writeFileSync(keyPath , process.env.key);


// initialize storage
const storage = new Storage({
    keyFilename: keyPath,
    projectId: process.env.projectId
});
// const storage = new Storage();

const bucket = storage.bucket(process.env.bucket);

// multer
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

// route
router
.post('/', multer.single('image'), (req, res) => {
    const file = req.file;
    const public = req.body.public || true;
	console.log('file recieved');
	if (file) {	
		uploadImageToStorage(file, public)
		.then((result => {
            console.log("URL : ",result);
			res.status(200).json({ success : true, err : false, url : result})
		}))
		.catch(err => res.status(500).json({success : false, err : err, url : null}));
	}
})

.get('/', (req, res) => {
	res.json({message : "ok"});
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
			console.log(error);
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
