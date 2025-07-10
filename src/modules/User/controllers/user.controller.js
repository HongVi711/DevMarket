const responseFormat = require("../../../shared/utils/response");
const userService = require("../services/user.service");
const AppError = require("../../../shared/utils/appError");

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
    const userID = req.params.id ? req.params.id : req.user.id;
    const user = await userService.getUserById(userID);
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
    return responseFormat.error({ res: res, errorObject: error });
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

const getUserWithBioById = async (req, res) => {
  try {
    const userID = req.params.id || req.user.id; // Sử dụng req.user.id nếu không có req.params.id
    const userWithBio = await userService.getUserWithBioById(userID);
    return responseFormat.success(
      res,
      userWithBio,
      "Lấy thông tin người dùng và bio thành công",
      200
    );
  } catch (error) {
    if (error instanceof AppError) {
      return responseFormat.error({
        res,
        message: error.message,
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        errorObject: error
      });
    }
    return responseFormat.error({ res, errorObject: error });
  }
};

const updateUserWithBio = async (req, res) => {
  try {
    const userID = req.params.id || req.user.id; // Dùng req.user.id cho người dùng xác thực hoặc req.params.id

    // Nếu bio là string JSON thì parse ra object
    if (typeof req.body.bio === "string") {
      try {
        req.body.bio = JSON.parse(req.body.bio);
      } catch (err) {
        return res.status(400).json({
          status: "error",
          message: "Dữ liệu bio không hợp lệ, phải là JSON hợp lệ",
        });
      }
    }
    // Phân tách dữ liệu từ body
    const { bio = {}, ...userData } = req.body; // bio chứa dữ liệu Bio, còn lại là User
    if (req.cloudinaryUrl) {
      userData.photo = req.cloudinaryUrl; // Cập nhật photo nếu có upload
      // console.log("Set userData.photo:", userData.photo);
    }
    if (req.cloudinaryBackgroundUrl) {
      bio.backgroundImage = req.cloudinaryBackgroundUrl; // Cập nhật backgroundImage nếu có upload
      // console.log("Set bio.backgroundImage:", bio.backgroundImage);
    }

    // Gọi service để cập nhật
    const updatedData = await userService.updateUserWithBio(userID, userData, bio);
    return responseFormat.success(
      res,
      updatedData,
      "Cập nhật thông tin người dùng và bio thành công",
      200
    );
  } catch (error) {
    if (error instanceof AppError) {
      return responseFormat.error({
        res,
        message: error.message,
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        errorObject: error,
      });
    }
    return responseFormat.error({ res, errorObject: error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  getUserWithBioById,
  updateUserWithBio
};
