const Employee = require('../models/Employee');
const { body, validationResult } = require('express-validator');


exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.createEmployee = [
    // Validation and Sanitization
    body('first_name').notEmpty().trim().escape(),
    body('last_name').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('position').notEmpty().trim().escape(),
    body('salary').isNumeric(),
    body('date_of_joining').isISO8601().toDate(),
    body('department').notEmpty().trim().escape(),

    async (req, res) => {
        // Handle Validation Errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Check if Employee Exists
            let employee = await Employee.findOne({ email: req.body.email });
            if (employee) {
                return res.status(400).json({ message: 'Employee already exists.' });
            }

            // Create New Employee
            employee = new Employee(req.body);
            await employee.save();

            res.status(201).json({
                message: 'Employee created successfully.',
                employee_id: employee._id,
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },
];

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.eid);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(200).json(employee);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(500).send('Server Error');
    }
};


exports.updateEmployee = async (req, res) => {
    try {
        // Update Fields
        const updates = req.body;
        updates.updated_at = Date.now();

        const employee = await Employee.findByIdAndUpdate(
            req.params.eid,
            { $set: updates },
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.status(200).json({
            message: 'Employee details updated successfully.',
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(500).send('Server Error');
    }
};

exports.deleteEmployee = async (req, res) => {
    const eid = req.query.eid;
    try {
        const employee = await Employee.findByIdAndDelete(eid);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(204).json({
            message: 'Employee deleted successfully.',
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(500).send('Server Error');
    }
};
