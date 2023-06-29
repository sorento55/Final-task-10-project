var express = require('express');
var router = express.Router();

var StudentService = require('../services/StudentService');
var ApiSecurity = require('../middlewares/apiSecurity');


router.get('/all', ApiSecurity.requireLogin, StudentService.getAllStudents);
router.get('/search', StudentService.search);
router.get('/:id', StudentService.getStudent);
router.post('/', ApiSecurity.requirePermits('student.add'), StudentService.addStudent);
router.put('/:id', ApiSecurity.requirePermits('student.update', 'student.add'), StudentService.updateStudent);

module.exports = router;