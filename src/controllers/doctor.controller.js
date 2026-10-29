const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

function pickDoctorFields(body) {
  const fields = ["name", "specialization", "email", "phone", "experienceYears"];
  const data = {};
  for (const field of fields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }
  return data;
}

const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await prisma.doctor.create({
    data: pickDoctorFields(req.body),
  });

  res.status(201).json({
    success: true,
    message: "Doctor created successfully",
    data: doctor,
  });
});

const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await prisma.doctor.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    success: true,
    data: doctors,
  });
});

const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: req.params.id },
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

const updateDoctor = asyncHandler(async (req, res) => {
  const existing = await prisma.doctor.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new ApiError(404, "Doctor not found");
  }

  const doctor = await prisma.doctor.update({
    where: { id: req.params.id },
    data: pickDoctorFields(req.body),
  });

  res.status(200).json({
    success: true,
    message: "Doctor updated successfully",
    data: doctor,
  });
});

const deleteDoctor = asyncHandler(async (req, res) => {
  const existing = await prisma.doctor.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new ApiError(404, "Doctor not found");
  }

  await prisma.doctor.delete({ where: { id: req.params.id } });

  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully",
  });
});

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
