const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((item) => ({
    field: item.path,
    message: item.msg,
  }));

  next(new ApiError(400, "Validation failed", errors));
}

module.exports = validate;
