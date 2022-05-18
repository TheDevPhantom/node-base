import jwt from "jsonwebtoken";
import asyncHandler from "./async.js";
import ErrorResponse from "../utils/errorResponse.js";

import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);

    next();
  } catch (err) {
    console.log(err);
    if ((err.name = "TokenExpiredError")) {
      return next(new ErrorResponse("Token expired, please login again", 401));
    }
    return next(new ErrorResponse("Not authorized to access this route", 403));
  }
});

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.roles} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
}
