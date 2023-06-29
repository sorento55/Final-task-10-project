const FileModel = require('../models/file');
const ApiResponse = require('../utils/ApiResponse');
const mongoose = require('mongoose');
const fs = require('fs');

module.exports = {
  uploadFile: async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId();

      const nameParts = req.file.originalname.split('.');
      const extension = nameParts[nameParts.length - 1];

      const filePath = `C://fileServer/${id}.${extension}`;

      fs.writeFileSync(filePath, fs.readFileSync(req.file.path));

      fs.unlinkSync(req.file.path);

      const file = await new FileModel({
        _id: id,
        fileName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: filePath
      }).save();

      ApiResponse.success(res, file);

    } catch (error) {
      ApiResponse.failure(res, error, 'error_on_uploadFile');
    }
  },

  download: async (req, res) => {
    try {
      const file = await FileModel.findById(req.params.fileId);
      if (!file) {
        return ApiResponse.failure(res, {}, 'file_not_found', 404);
      }

      res.set({
        'Content-Disposition': 'attachment; filename=' + file.fileName,
        'Content-Type': file.mimetype
      });
      fs.createReadStream(file.path).pipe(res);

    } catch (error) {
      ApiResponse.failure(res, error, 'error_on_downloadFile');
    }
  }
}