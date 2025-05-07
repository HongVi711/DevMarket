const userRepository = require("../Repository/user.repository");

const getAllUsers = async (skip, limit) => {
  return await userRepository.getAllUsers(skip, limit);
};

const getUserById = async (id) => {
  return await userRepository.getUserById(id);
};

const deleteUserById = async (id) => {
  return await userRepository.deleteUser(id);
};

const updateUserById = async (id, user) => {
  return await userRepository.updateUser(id, user);
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById
};
