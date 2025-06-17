const bioRepository = require("../Repository/bio.repository");

exports.getBioByUri = async (uri) => {
  try {
    const bio = await bioRepository.getInfoByUri(uri);
    return bio;
  } catch (error) {
    throw error;
  }
};
