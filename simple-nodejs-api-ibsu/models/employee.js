let employees = []; // Array to store employee data

// Function to add a new employee
function addEmployee(employee) {
  employees.push(employee);
}

// Function to retrieve all employees
function getAllEmployees() {
  return employees;
}

// Function to retrieve an employee by ID
function getEmployeeById(id) {
  return employees.find((employee) => employee.id === id);
}

// Function to update employee information
function updateEmployee(employee) {
  const index = employees.findIndex((e) => e.id === employee.id);
  if (index !== -1) {
    employees[index] = employee;
  }
}

module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
};


