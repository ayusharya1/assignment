const express = require("express");
const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patient.controller");
const {
  createPatientValidator,
  updatePatientValidator,
  patientIdParam,
} = require("../validators/patient.validators");

const router = express.Router();

router.use(authenticate);

router.post("/", createPatientValidator, validate, createPatient);
router.get("/", getPatients);
router.get("/:id", patientIdParam, validate, getPatientById);
router.put("/:id", updatePatientValidator, validate, updatePatient);
router.delete("/:id", patientIdParam, validate, deletePatient);

module.exports = router;
