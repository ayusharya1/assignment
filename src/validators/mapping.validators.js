const { body, param } = require("express-validator");

const createMappingValidator = [
  body("patientId").isInt({ min: 1 }).withMessage("patientId must be a positive integer").toInt(),
  body("doctorId").isInt({ min: 1 }).withMessage("doctorId must be a positive integer").toInt(),
];

const mappingIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Mapping id must be a positive integer").toInt(),
];

const mappingPatientIdParam = [
  param("patient_id").isInt({ min: 1 }).withMessage("Patient id must be a positive integer").toInt(),
];

module.exports = { createMappingValidator, mappingIdParam, mappingPatientIdParam };
