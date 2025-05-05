const responseFormat = require("../utils/response");
const userService = require("../services/user.service");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return responseFormat.successResponse(res, users);
  } catch (error) {
    return responseFormat.errorResponse(res, error);
  }
};

module.exports = {
  getAllUsers
};
