const express = require('express');


const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

const bucket = storage.bucket('adithya-assignment');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

const router = express.Router();


router.route("/upload").post(upload.single('file'),(req, res) => {

    try{

    
    const file = req.file;
    //console.log(file)

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();
  
    // blobStream.on('error', (err) => {
    //   res.status(500).send(err);
    // });
  
    blobStream.on('finish', () => {
      res.status(200).send('File uploaded to GCS.');
    });
  
    blobStream.end(file.buffer);
}catch(err){
    res.status(500).send(err);
}
});



module.exports = router