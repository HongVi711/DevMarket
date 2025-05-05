const userRepository = require("../Repository/user.repository");

const getAllUsers = async (skip, limit) => {
  return await userRepository.getAllUsers(skip, limit);
};

module.exports = {
  getAllUsers
};
