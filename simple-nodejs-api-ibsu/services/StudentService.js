const StudentModel = require('../models/student');
const ApiResponse = require('../utils/ApiResponse');

module.exports = {

  getAllStudents: async (req, res) => {
    try {
      // StudentModel.find({})
      //   .then(students => {
      //     res.status(200).json({ students, success: true });
      //   })
      //   .catch(error => {
      //     res.status(500).json({ error, success: false });
      //   });

      const students = await StudentModel.find({});
      ApiResponse.success(res, students);
    } catch (error) {
      ApiResponse.failure(res, error, 'error_on_getAllStudents');
    }
  },

  getStudent: async (req, res) => {
    try {
      const student = await StudentModel.findById(req.params.id);
      ApiResponse.success(res, student);
    } catch (error) {
      ApiResponse.failure(res, error, 'error_on_getStudent');
    }
  },

  addStudent: async (req, res) => {
    try {
      const body = req.body;
      const requiredFields = ['firstName', 'lastName', 'studentCode'];
      for (const field of requiredFields) {
        if (!body[field]) {
          return ApiResponse.failure(res, {}, `${field} is missing`, 400);
        }
      }
      const result = await new StudentModel(body).save();
      ApiResponse.success(res, result);
    } catch (error) {
      ApiResponse.failure(res, error, 'error_on_addStudent');
    }
  },

  updateStudent: async (req, res) => {
    try {
      const rec = await StudentModel.findByIdAndUpdate({
        _id: req.params.id
      }, {
        $set: req.body
      }, {
        new: true
      });
      if (!rec) {
        return ApiResponse.failure(res, {}, 'record_not_found', 404);
      }
      ApiResponse.success(res, rec);
    } catch (error) {
      ApiResponse.failure(res, error, 'error_on_updateStudent');
    }
  },

  search: async (req, res) => {
    try {
      const query = req.query;
      let skip = 0;
      let limit = 10;
      if (query.skip) {
        skip = +query.skip;
      }
      if (query.limit) {
        limit = +query.limit;
      }
      const queryForSearch = {};
      if (req.query.searchText) {
        queryForSearch.$or = [{
          firstName: new RegExp(`.*${req.query.searchText}.*`, "i")
        }, {
          lastName: new RegExp(`.*${req.query.searchText}.*`, "i")
        }, {
          studentCode: new RegExp(`.*${req.query.searchText}.*`, "i")
        }]
      }
      const result = await StudentModel.find(queryForSearch)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean();
      ApiResponse.success(res, result);
    } catch (error) {
      ApiResponse.failure(res, error, 'error_on_search');
    }
  }

};