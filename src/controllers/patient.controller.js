const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

function pickPatientFields(body) {
  const fields = ["name", "age", "gender", "phone", "address", "medicalHistory"];
  const data = {};
  for (const field of fields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }
  return data;
}

async function findOwnedPatient(id, userId) {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { mappings: { include: { doctor: true } } },
  });

  if (!patient || patient.createdById !== userId) {
    throw new ApiError(404, "Patient not found");
  }

  return patient;
}

const createPatient = asyncHandler(async (req, res) => {
  const patient = await prisma.patient.create({
    data: {
      ...pickPatientFields(req.body),
      createdById: req.user.id,
    },
  });

  res.status(201).json({
    success: true,
    message: "Patient created successfully",
    data: patient,
  });
});

const getPatients = asyncHandler(async (req, res) => {
  const patients = await prisma.patient.findMany({
    where: { createdById: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    success: true,
    data: patients,
  });
});

const getPatientById = asyncHandler(async (req, res) => {
  const patient = await findOwnedPatient(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    data: patient,
  });
});

const updatePatient = asyncHandler(async (req, res) => {
  await findOwnedPatient(req.params.id, req.user.id);

  const patient = await prisma.patient.update({
    where: { id: req.params.id },
    data: pickPatientFields(req.body),
  });

  res.status(200).json({
    success: true,
    message: "Patient updated successfully",
    data: patient,
  });
});

const deletePatient = asyncHandler(async (req, res) => {
  await findOwnedPatient(req.params.id, req.user.id);

  await prisma.patient.delete({ where: { id: req.params.id } });

  res.status(200).json({
    success: true,
    message: "Patient deleted successfully",
  });
});

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
