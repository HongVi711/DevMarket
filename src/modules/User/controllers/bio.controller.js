const bioService = require("../services/bio.service");
const AppError = require("../../../shared/utils/appError");
const responseFormat = require("../../../shared/utils/response");

exports.getBioByUri = async (req, res) => {
  try {
    const bioInfo = await bioService.getBioByUri(req.params.uri);
    return responseFormat.success(
      res,
      bioInfo,
      "Lấy thông tin thành công",
      200
    );
  } catch (error) {
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
    return responseFormat.error({ res });
  }
};

