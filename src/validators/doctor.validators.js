const { body, param } = require("express-validator");

const doctorIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Doctor id must be a positive integer").toInt(),
];

const createDoctorValidator = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 100 }),
  body("specialization").trim().notEmpty().withMessage("Specialization is required").isLength({ max: 120 }),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("phone").trim().notEmpty().withMessage("Phone is required").isLength({ min: 8, max: 20 }),
  body("experienceYears").isInt({ min: 0, max: 80 }).withMessage("Experience years must be between 0 and 80").toInt(),
];

const updateDoctorValidator = [
  ...doctorIdParam,
  body("name").optional().trim().notEmpty().isLength({ min: 2, max: 100 }),
  body("specialization").optional().trim().notEmpty().isLength({ max: 120 }),
  body("email").optional().trim().isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("phone").optional().trim().notEmpty().isLength({ min: 8, max: 20 }),
  body("experienceYears").optional().isInt({ min: 0, max: 80 }).toInt(),
];

module.exports = { createDoctorValidator, updateDoctorValidator, doctorIdParam };
