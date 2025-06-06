const responseFormat = require("../utils/response");
const userService = require("../services/user.service");
const AppError = require("../utils/appError");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return responseFormat.success(res, users);
  } catch (error) {
    // Nếu là AppError thì trả đúng format bạn đã chuẩn hoá
    if (error instanceof AppError) {
      return responseFormat.error({
        res,
        message: error.message,
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        errorObject: error
      });
    }

    // Còn lại là lỗi không đoán trước được
    return responseFormat.error({ res });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return responseFormat.success(res, user);
  } catch (error) {
    // Nếu là AppError thì trả đúng format bạn đã chuẩn hoá
    if (error instanceof AppError) {
      return responseFormat.error({
        res,
        message: error.message,
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        errorObject: error
      });
    }

    // Còn lại là lỗi không đoán trước được
    return responseFormat.error({ res });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await userService.deleteUserById(req.params.id);
    return responseFormat.success(res, user, "Xóa người dùng thành công.", 200);
  } catch (error) {
    // Nếu là AppError thì trả đúng format bạn đã chuẩn hoá
    if (error instanceof AppError) {
      return responseFormat.error({
        res,
        message: error.message,
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        errorObject: error
      });
    }

    // Còn lại là lỗi không đoán trước được
    return responseFormat.error({ res });
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
    // Nếu là AppError thì trả đúng format bạn đã chuẩn hoá
    if (error instanceof AppError) {
      return responseFormat.error({
        res,
        message: error.message,
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        errorObject: error
      });
    }

    // Còn lại là lỗi không đoán trước được
    return responseFormat.error({ res });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById
};
