const roleModel = require("../models/role.model");
const userModel = require("../models/user.model");

exports.getAllRoles = async (skip, limit) => {
  try {
    const roles = await roleModel.find().skip(skip).limit(limit);
    return roles;
  } catch (error) {
    throw error;
  }
};

exports.countRoles = async () => {
  return await roleModel.countDocuments();
};

exports.createRole = async (name, description, permissions) => {
  try {
    name = name.toLowerCase();
    const role = await roleModel.create({ name, description, permissions });
    return role;
  } catch (error) {
    throw error;
  }
};

exports.getRoleByName = async (name) => {
  try {
    const role = await roleModel.findOne({
      name: new RegExp(`^${name}$`, "i")
    });
    return role;
  } catch (error) {
    throw error;
  }
};

exports.updateRole = async (name, roleData) => {
  try {
    roleData.permissions = roleData.permissions.map((item) =>
      item.toLowerCase()
    );
    const role = await roleModel.findOneAndUpdate(
      {
        name: new RegExp(`^${name}$`, "i")
      },
      roleData,
      {
        new: true,
        runValidators: true
      }
    );
    return role;
  } catch (error) {
    throw error;
  }
};

exports.deleteRoleByName = async (name) => {
  try {
    const role = await roleModel.findOne({
      name: new RegExp(`^${name}$`, "i")
    });
    const users = await userModel.find({ role: role._id });

    if (users.length > 0) {
      throw new Error(
        "Không thể xoá role, vui lòng gỡ role này trên các người dùng đang sở hữu!"
      );
    }
    await roleModel.deleteOne({
      name: new RegExp(`^${name}$`, "i")
    });

    return role;
  } catch (error) {
    throw error;
  }
};
