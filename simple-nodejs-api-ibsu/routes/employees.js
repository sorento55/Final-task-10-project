const express = require('express');
const router = express.Router();

const Employee = require('../models/employee'); // Import the Employee model

// Retrieve all employees
router.get('/', (req, res) => {
  const { search, page, limit } = req.query;
  let filteredEmployees = Employee.getAllEmployees();

  // Filter employees based on search text
  if (search) {
    const searchText = search.toLowerCase();
    filteredEmployees = filteredEmployees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(searchText) ||
        employee.lastName.toLowerCase().includes(searchText) ||
        employee.pid.toLowerCase().includes(searchText) ||
        employee.position.toLowerCase().includes(searchText)
    );
  }

  // Pagination
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  res.json({
    totalResults: filteredEmployees.length,
    totalPages: Math.ceil(filteredEmployees.length / pageSize),
    currentPage: pageNumber,
    pageSize: pageSize,
    employees: paginatedEmployees,
  });
});

// Retrieve one employee by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const employee = Employee.getEmployeeById(id);

  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

// Add a new employee
router.post('/', (req, res) => {
  const employee = req.body;
  Employee.addEmployee(employee);
  res.status(201).json(employee);
});

// Update employee information
router.patch('/:id', (req, res) => {
  const id = req.params.id;
  const updatedEmployee = req.body;
  updatedEmployee.id = id;
  Employee.updateEmployee(updatedEmployee);
  res.json(updatedEmployee);
});

router.get('/search', async (req, res) => {
  const { searchText, page, limit } = req.query;

  try {
    const regex = new RegExp(searchText, 'i');

    const employees = await Employee.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { pid: regex },
        { position: regex }
      ]
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Retrieve the total count of matching employees
    const totalCount = await Employee.countDocuments({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { pid: regex },
        { position: regex }
      ]
    });

    res.json({
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      employees
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;