const projectModel = require('../models/project.model');

exports.getAllProjects = async(req) => {
    return await projectModel.getAllProjects(req);
}

exports.getProjectDetailBySlug  =  async(slug) => {
    return await projectModel.getProjectBySlug(slug);
}

exports.create = async (data) => {
  return await projectModel.create(data);
}

exports.findBySlug = async (slug) => {
  return await projectModel.findOne({ slug });
}

exports.find = (query, sort) => {
    return projectModel
        .find(query)
        .populate("authorId", "displayName photo email")
        .populate("learningPackId", "title description")
        .populate("technologies", "name slug")
        .select("title slug description thumbnailUrl demoVideoUrl level technologies price discountPrice createdAt authorId isPublished isBundleItem learningPackId")
        .sort(sort);
};