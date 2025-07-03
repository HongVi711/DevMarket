const userRepository = require("../Repository/user.repository");
const roleRepository = require("../Repository/role.repository");
const bioRepository = require("../Repository/bio.repository");

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

const getUserWithBioById = async (id) => {
  return await userRepository.getUserWithBioById(id);
};

const updateUserWithBio = async (id, user, bioData) => {
  try {
    // Cập nhật User
    const updatedUser = await userRepository.updateUser(id, user);

    // Cập nhật Bio
    const updatedBio = await bioRepository.updateBio(id, bioData);

    return { user: updatedUser, bio: updatedBio };
  } catch (error) {
    throw error;
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
