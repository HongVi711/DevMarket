const bioRepository = require("../repository/bio.repository");

exports.getBioByUri = async (uri) => {
  try {
    const bio = await bioRepository.getInfoByUri(uri);
    return bio;
  } catch (error) {
    throw error;
  }
};


