const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
  fileName: { type: String },
  size: { type: Number },
  mimetype: { type: String },
  path: { type: String }
}, {
  collection: 'files',
  timestamps: true,
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 30000
  },
  read: 'nearest'
});

const model = mongoose.model('File', fileSchema);
module.exports = model;