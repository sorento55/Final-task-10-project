var express = require('express');
var router = express.Router();

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

const FileService = require('../services/FileService');

router.post('/upload', upload.single('file'), FileService.uploadFile);
router.get('/:fileId', FileService.download);


module.exports = router;