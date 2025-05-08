const userRepository = require("../Repository/user.repository");
const roleRepository = require("../Repository/role.repository");

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
  if (user.role == "") {
    const role = await roleRepository.getRoleByName("user");
    user.role = role._id;
  }
  return await userRepository.updateUser(id, user);
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById
};
