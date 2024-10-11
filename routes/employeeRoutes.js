const express = require('express');
const router = express.Router();
const {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} = require('../controllers/employeeController');

// Get all employees
router.get('/employees', getEmployees);

// Create new employee
router.post('/employees', createEmployee);

// Get employee by ID
router.get('/employees/:eid', getEmployeeById);

// Update employee by ID
router.put('/employees/:eid', updateEmployee);

// Delete employee by ID (using query parameter)
router.delete('/employees', deleteEmployee);

module.exports = router;
