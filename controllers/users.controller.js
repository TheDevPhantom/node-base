import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/async.js";
import User from "../models/User.js";

// @desc      Get users
// @route     GET /api/v1/users
// @access    Public
export const GetUsers = asyncHandler(async (req, res, next) => {
  const users = await User.findAll(req.filters.config);

  res.status(200).json({
    success: true,
    count: users.length,
    pagination: req.filters.pagination,
    data: users,
  });
});

// @desc      Get user
// @route     GET /api/v1/users/1
// @access    Public
export const GetUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User with id of ${req.params.id} not found.`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private
export const CreateUsers = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Edit user
// @route     PUT /api/v1/users/1
// @access    Private
export const EditUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User with id of ${req.params.id} not found.`, 404)
    );
  }

  await user.update(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/users/1
// @access    Private
export const DeleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User with id of ${req.params.id} not found.`, 404)
    );
  }

  await user.destroy();

  res.status(200).json({
    success: true,
  });
});
