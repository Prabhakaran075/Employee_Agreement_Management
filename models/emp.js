const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
    employeeName: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: Date, required: true }, // Changed to Date for proper validation
    endDate: { type: Date, required: true },
    salary: { type: Number, required: true, min: 0 }, // Added validation for non-negative salary
    terms: { type: String, required: true },
    otherDetails: {
        department: { type: String, required: true },
        manager: { type: String, required: true }
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('Employee', empSchema);
