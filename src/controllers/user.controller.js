const responseFormat = require("../utils/response");
const userService = require("../services/user.service");
const AppError = require("../utils/appError");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return responseFormat.success(res, users);
  } catch (error) {
    if (error instanceof AppError) {
      return responseFormat.error(
        res,
        error.message,
        error.errorCode,
        error.statusCode
      );
    }

    return responseFormat.error(res, "Đã có lỗi xảy ra. Vui lòng thử lại.");
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return responseFormat.success(res, user);
  } catch (error) {
    if (error instanceof AppError) {
      return responseFormat.error(
        res,
        error.message,
        error.errorCode,
        error.statusCode
      );
    }

    return responseFormat.error(res, "Đã có lỗi xảy ra. Vui lòng thử lại.");
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await userService.deleteUserById(req.params.id);
    return responseFormat.success(res, user, "Xóa người dùng thành công.", 200);
  } catch (error) {
    if (error instanceof AppError) {
      return responseFormat.error(
        res,
        error.message,
        error.errorCode,
        error.statusCode
      );
    }

    return responseFormat.error(res, "Đã có lỗi xảy ra. Vui lòng thử lại.");
  }
};

const updateUserById = async (req, res) => {
  try {
    req.body.photo = req.cloudinaryUrl;
    const user = await userService.updateUserById(req.params.id, req.body);
    return responseFormat.success(
      res,
      user,
      "Cập nhật người dùng thành công",
      200
    );
  } catch (error) {
    if (error instanceof AppError) {
      return responseFormat.error(
        res,
        error.message,
        error.errorCode,
        error.statusCode
      );
    }

    return responseFormat.error(res, error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById
};
