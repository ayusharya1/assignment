const express = require("express");
const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctor.controller");
const {
  createDoctorValidator,
  updateDoctorValidator,
  doctorIdParam,
} = require("../validators/doctor.validators");

const router = express.Router();

router.use(authenticate);

router.post("/", createDoctorValidator, validate, createDoctor);
router.get("/", getDoctors);
router.get("/:id", doctorIdParam, validate, getDoctorById);
router.put("/:id", updateDoctorValidator, validate, updateDoctor);
router.delete("/:id", doctorIdParam, validate, deleteDoctor);

module.exports = router;
