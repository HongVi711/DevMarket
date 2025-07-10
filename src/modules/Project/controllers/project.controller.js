const projectService = require('../services/project.service');
const responseFormat = require("../../../shared/utils/response");
const AppError = require("../../../shared/utils/appError");

exports.getAllProjects = async(req, res) =>{
    try {
        const project  = await projectService.getAllProjects(req);
        return responseFormat.success(res, project);
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
    return responseFormat.error({ res });
    }
}

exports.getProjectDetailBySlug = async(req, res) =>{
    try {
        const project  = await projectService.getProjectDetailBySlug(req.params.slug);
        return responseFormat.success(res, project,"Lấy thông tin thành công", 200 );
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
        return responseFormat.error({ res });
    }
}

exports.createProject = async (req, res) => {
  try {
        const projectData = req.body;
        const userId = req.params.id ? req.params.id : req.user.id; // Use _id from auth middleware
        const newProject = await projectService.createProject(projectData, userId);
        return responseFormat.success(res, newProject,"Tạo project thành công", 200 );
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
        return responseFormat.error({ res });
    }
}