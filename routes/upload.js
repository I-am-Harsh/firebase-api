const {Storage} = require('@google-cloud/storage');
const Multer = require('multer');
var express = require('express');
var router = express.Router();

/* GET home page. */

const storage = new Storage({
    keyFilename: "image-api-91bce-firebase-adminsdk-ldyiw-c1ca6e58c2.json",
    projectId: "image-api-91bce"
    // projectId:
});
// const storage = new Storage();

const bucket = storage.bucket("image-api-91bce.appspot.com");

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});
console.log(process.env.projectId);
// const storageRef = storage.

router

.post('/', multer.single('image'), (req, res) => {
	const file = req.file;
	console.log('file recieved');
	if (file) {	
		uploadImageToStorage(file)
		.then((result => {
			res.status(200).json({ success : true, err : false})
		}))
		.catch(err => res.status(200).json({success : false, err : err}));
	}
})

.get('/', (req, res) => {
	res.send("Ok");
})



const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        let newFileName = `${file.originalname}_${Date.now()}`;

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

        // blobStream.on('finish', () => {
        //     // The public URL can be used to directly access the file via HTTP.
        //     const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
        //     resolve(url);
        // });

        blobStream.end(file.buffer);
    });
}


module.exports = router;
