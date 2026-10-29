const express = require("express");
const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createMapping,
  getMappings,
  getDoctorsForPatient,
  deleteMapping,
} = require("../controllers/mapping.controller");
const {
  createMappingValidator,
  mappingIdParam,
  mappingPatientIdParam,
} = require("../validators/mapping.validators");

const router = express.Router();

router.use(authenticate);

router.post("/", createMappingValidator, validate, createMapping);
router.get("/", getMappings);
router.get("/:patient_id", mappingPatientIdParam, validate, getDoctorsForPatient);
router.delete("/:id", mappingIdParam, validate, deleteMapping);

module.exports = router;
