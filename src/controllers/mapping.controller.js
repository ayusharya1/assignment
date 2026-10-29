const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const mappingInclude = {
  patient: true,
  doctor: true,
};

const createMapping = asyncHandler(async (req, res) => {
  const { patientId, doctorId } = req.body;

  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient || patient.createdById !== req.user.id) {
    throw new ApiError(404, "Patient not found");
  }

  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const existing = await prisma.patientDoctor.findUnique({
    where: { patientId_doctorId: { patientId, doctorId } },
  });
  if (existing) {
    throw new ApiError(409, "This doctor is already assigned to the patient");
  }

  const mapping = await prisma.patientDoctor.create({
    data: { patientId, doctorId },
    include: mappingInclude,
  });

  res.status(201).json({
    success: true,
    message: "Doctor assigned to patient successfully",
    data: mapping,
  });
});

const getMappings = asyncHandler(async (req, res) => {
  const mappings = await prisma.patientDoctor.findMany({
    where: { patient: { createdById: req.user.id } },
    include: mappingInclude,
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    success: true,
    data: mappings,
  });
});

const getDoctorsForPatient = asyncHandler(async (req, res) => {
  const patientId = req.params.patient_id;

  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient || patient.createdById !== req.user.id) {
    throw new ApiError(404, "Patient not found");
  }

  const mappings = await prisma.patientDoctor.findMany({
    where: { patientId },
    include: { doctor: true },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    success: true,
    data: mappings.map((mapping) => mapping.doctor),
  });
});

const deleteMapping = asyncHandler(async (req, res) => {
  const mapping = await prisma.patientDoctor.findUnique({
    where: { id: req.params.id },
    include: { patient: true },
  });

  if (!mapping || mapping.patient.createdById !== req.user.id) {
    throw new ApiError(404, "Mapping not found");
  }

  await prisma.patientDoctor.delete({ where: { id: mapping.id } });

  res.status(200).json({
    success: true,
    message: "Doctor removed from patient successfully",
  });
});

module.exports = {
  createMapping,
  getMappings,
  getDoctorsForPatient,
  deleteMapping,
};
