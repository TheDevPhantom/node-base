import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/async.js";
import User from "../models/User.js";

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
export const register = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  const existingUser = await User.findOne({
    where: {
      email,
    },
  });

  if (existingUser) {
    return next(
      new ErrorResponse(
        `There is already a user with the same credentials.`,
        400
      )
    );
  }

  // Create user
  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
  });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Check for user
    const user = await User.findOne({
      where: { email },
      attributes: { include: ["password"] },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const valid = await user.validatePassword(password);

    if (!valid) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.log(error);
  }
});

// @desc      Update password for logged in user
// @route     POST /api/v1/auth/updatepassword
// @access    Private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { password, newPassword } = req.body;

  if (!password) {
    return next(new ErrorResponse("Please provide your current password", 400));
  }

  if (!newPassword) {
    return next(new ErrorResponse("Please provide a new password", 400));
  }

  const user = await User.findByPk(req.user.id, {
    attributes: { include: ["password"] },
  });

  const valid = await user.validatePassword(password);

  if (!valid) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  await user.update({ password: newPassword });

  res.status(200).json({
    success: true,
  });
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get current logged in user detials
// @route     GET /api/v1/auth/me
// @access    Private
export const getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getToken();

  delete user.dataValues.password;

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
