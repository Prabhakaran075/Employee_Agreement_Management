const express = require('express');
const router = express.Router();
const Employee = require('../models/emp');

// GET all employees
// GET all employees with pagination and sorting
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    try {
        const employees = await Employee.find()
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Employee.countDocuments();
        res.status(200).json({
            total,
            page: Number(page),
            limit: Number(limit),
            employees
        });
    } catch (err) {
        res.status(500).json({ error: `Error retrieving employees: ${err.message}` });
    }
});


// GET a unique employee
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: `Error retrieving employee: ${err.message}` });
    }
});

// POST a new employee
// POST: Create a new employee
router.post('/', async (req, res) => {
    const { employeeName, role, startDate, endDate, salary, terms, otherDetails } = req.body;

    if (!employeeName || !role || !startDate || !endDate || !salary || !terms || !otherDetails?.department || !otherDetails?.manager) {
        return res.status(400).json({
            error: "Missing required fields. Please ensure all fields, including 'otherDetails.department' and 'otherDetails.manager', are provided."
        });
    }

    // Validate business rules
    if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ error: "Start date must be earlier than end date." });
    }

    if (salary < 0) {
        return res.status(400).json({ error: "Salary cannot be negative." });
    }

    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(400).json({ error: `Error saving employee: ${err.message}` });
    }
});

// Similarly, add the above validation logic in PUT and PATCH handlers.


// PATCH: Partially update an employee
// PATCH: Partially update an employee
router.patch('/:id', async (req, res) => {
    const { startDate, endDate, salary } = req.body;

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ error: "Start date must be earlier than end date." });
    }

    if (salary && salary < 0) {
        return res.status(400).json({ error: "Salary cannot be negative." });
    }

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ error: `Error updating employee: ${err.message}` });
    }
});


// PUT: Completely replace an employee
// PUT: Completely replace an employee
router.put('/:id', async (req, res) => {
    const { employeeName, role, startDate, endDate, salary, terms, otherDetails } = req.body;

    if (!employeeName || !role || !startDate || !endDate || !salary || !terms || !otherDetails?.department || !otherDetails?.manager) {
        return res.status(400).json({
            error: "Missing required fields. Please ensure all fields, including 'otherDetails.department' and 'otherDetails.manager', are provided."
        });
    }

    // Validate business rules
    if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ error: "Start date must be earlier than end date." });
    }

    if (salary < 0) {
        return res.status(400).json({ error: "Salary cannot be negative." });
    }

    try {
        const replacedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!replacedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json(replacedEmployee);
    } catch (err) {
        res.status(400).json({ error: `Error replacing employee: ${err.message}` });
    }
});

// DELETE: Remove an employee
router.delete('/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

        if (!deletedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json({ message: "Employee Agreement successfully deleted", deletedEmployee });
    } catch (err) {
        res.status(500).json({ error: `Error deleting employee: ${err.message}` });
    }
});

module.exports = router;
