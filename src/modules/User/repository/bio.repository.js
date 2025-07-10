const bioModel = require("../../User/models/bio.model");

exports.getInfoByUri = async (uri) => {
  try {
    const bio = await bioModel
      .findOne({ Uri: uri })
      .populate("user", "displayName photo email phone");
    return bio;
  } catch (error) {
    throw error;
  }
};

exports.createBio = async (user) => {
  try {
    const bio = { user: user._id, Uri: user.username };
    const newBio = await bioModel.create(bio);
    return newBio;
  } catch (error) {
    throw error;
  }
};

exports.updateBio = async (userId, bioData) => {
  try {
    const bio = await bioModel.findOneAndUpdate(
      { user: userId },
      { $set: bioData },
      { new: true, runValidators: true }
    );
    
    if (!bio) {
      throw new Error("Bio không tồn tại");
    }
    return bio;
  } catch (error) {
    throw error;
  }
};