const responseFormat = require("../../../shared/utils/response");
const roleService = require("../services/role.service");

exports.createRole = async (req, res) => {
  try {
    const role = await roleService.createRole(
      req.body.name,
      req.body.description,
      req.body.permissions
    );
    return responseFormat.success(res, role, "Role created successfully", 201);
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
    return responseFormat.error({ res, message: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const roleName = req.params.name;
    const result = await roleService.deleteRole(roleName);
    return responseFormat.success(
      res,
      result,
      "Role deleted successfully",
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
    return responseFormat.error({ res, message: error.message });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const roles = await roleService.getAllRoles(page, limit);
    return responseFormat.success(res, roles, "Roles fetched successfully");
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
    return responseFormat.error({ res, message: error.message });
  }
};

exports.getRoleByName = async (req, res) => {
  try {
    const role = await roleService.getRoleByName(req.params.name);
    return responseFormat.success(res, role, "Role fetched successfully");
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
    return responseFormat.error({ res, message: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const roleName = req.params.name;
    const roleData = req.body;
    const role = await roleService.updateRole(roleName, roleData);
    return responseFormat.success(res, role, "Role updated successfully");
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
    return responseFormat.error({ res, message: error.message });
  }
};
