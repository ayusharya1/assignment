const { body, param } = require("express-validator");

const genderValues = ["male", "female", "other"];

const patientIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Patient id must be a positive integer").toInt(),
];

const createPatientValidator = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 100 }),
  body("age").isInt({ min: 0, max: 150 }).withMessage("Age must be between 0 and 150").toInt(),
  body("gender").isIn(genderValues).withMessage("Gender must be male, female, or other"),
  body("phone").trim().notEmpty().withMessage("Phone is required").isLength({ min: 8, max: 20 }),
  body("address").optional({ values: "falsy" }).trim().isLength({ max: 255 }),
  body("medicalHistory").optional({ values: "falsy" }).trim().isLength({ max: 2000 }),
];

const updatePatientValidator = [
  ...patientIdParam,
  body("name").optional().trim().notEmpty().isLength({ min: 2, max: 100 }),
  body("age").optional().isInt({ min: 0, max: 150 }).toInt(),
  body("gender").optional().isIn(genderValues).withMessage("Gender must be male, female, or other"),
  body("phone").optional().trim().notEmpty().isLength({ min: 8, max: 20 }),
  body("address").optional({ values: "null" }).trim().isLength({ max: 255 }),
  body("medicalHistory").optional({ values: "null" }).trim().isLength({ max: 2000 }),
];

module.exports = { createPatientValidator, updatePatientValidator, patientIdParam };
