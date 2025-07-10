const projectRepository = require('../repository/project.repository');
const projectTagModel = require('../models/projectTag.model');
const learningPackModel = require('../models/learningPack.model');

exports.getAllProjects = async(req)=>{
    try{
        const {
            search,
            technologies,
            level,
            sortBy = 'latest',
        } = req.query;

        const query = { isPublished: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (technologies) {
            const techArray = technologies.split(',').map(tech => tech.trim());
            query.technologies = { $in: techArray };
        }

        if (level) {
            query.level = level;
        }

        let sort = {};
        switch (sortBy) {
            case 'popular':
                sort = { 'viewStats.totalViews': -1 }; // Assuming ProjectViewStat is linked
                break;
            case 'price_asc':
                sort = { price: 1 };
                break;
            case 'price_desc':
                sort = { price: -1 };
                break;
            case 'latest':
            default:
                sort = { createdAt: -1 };
                break;
        }

        // const projects = await projectRepository
        //     .find(query)
        //     .populate("authorId","displayName photo email" )
        //     .populate("learningPackId", "title description")
        //     .select("title slug description thumbnailUrl demoVideoUrl level technologies price discountPrice createdAt authorId isPublished isBundleItem learningPackId")
        //     .sort(sort);

        const projects = await projectRepository.find(query, sort);
        return projects;
    }catch (error) {
    throw error;
  }
}

exports.getProjectBySlug = async (slug)=>{
    try {
        const project = await projectRepository
        .findOne({ slug, isPublished: true })
        .populate('authorId', 'displayName photo email')
        .populate('learningPackId', 'title description videoUrls documents')
        .select('title slug description thumbnailUrl demoVideoUrl level technologies price discountPrice createdAt updatedAt authorId isPublished isBundleItem learningPackId');

        if (!project) {
            throw new Error('Không tìm thấy hoặc project không được công khai');
        }

        const reviews = await Review.find({ projectId: project._id })
            .populate('userId', 'displayName photo') // nếu muốn show tên người review
            .select('rating comment createdAt userId')
            .sort({ createdAt: -1 });

        const similarProjects = await projectRepository
            .find({
                _id: { $ne: project._id }, // Exclude the current project
                isPublished: true,
                $or: [
                { technologies: { $in: project.technologies } },
                { level: project.level },
                ],
            })
            .select('title slug description thumbnailUrl level technologies price discountPrice')
            .limit(3) // Limit to 3 suggestions
            .sort({ createdAt: -1 });

        return {
            project: {
                id: project._id,
                title: project.title,
                slug: project.slug,
                description: project.description,
                thumbnailUrl: project.thumbnailUrl,
                demoVideoUrl: project.demoVideoUrl,
                level: project.level,
                technologies: project.technologies,
                price: project.price,
                discountPrice: project.discountPrice,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                author: project.authorId,
                isBundleItem: project.isBundleItem,
                learningPack: project.learningPackId,
            },
            reviews,
            similarProjects,
        };
        
    } catch (error) {
        throw error;
    }
}

exports.createProject = async (data, userId)=>{
    try {
        const {
            title,
            slug,
            description,
            technologies,
            level,
            price,
            thumbnailUrl,
            demoVideoUrl,
            tags,
            learningPackId,
        } = data;

        if (!title || !slug || !description || !technologies || !level || !price || !thumbnailUrl) {
            throw new Error('Missing required fields');
        }

        const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
        if (!validLevels.includes(level)) {
            throw new Error('Invalid level value');
        }

        const existingProject = await projectRepository.findBySlug(slug);
        if (existingProject) {
            throw new Error('Slug already exists');
        }

        let learningPack = null;
        if (learningPackId) {
            learningPack = await learningPackModel.findById(learningPackId);
            if (!learningPack) {
            throw new Error('Invalid learningPackId');
            }
        }

        let tagIds = [];
        if (tags && tags.length > 0) {
            tagIds = await Promise.all(
                tags.map(async (tagName) => {
                    let tag = await projectTagModel.findOne({ name: tagName });
                    if (!tag) {
                        tag = await projectTagModel.create({
                            name: tagName,
                            slug: tagName.toLowerCase().replace(/\s+/g, '-'),
                        });
                    }
                    return tag._id;
                })
            );
        }

          const projectPayload = {
            title,
            slug,
            description,
            technologies,
            level,
            price,
            thumbnailUrl,
            demoVideoUrl: demoVideoUrl || null,
            authorId: userId,
            isPublished: false,
            isBundleItem: false,
            learningPackId: learningPackId || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: tagIds,
        };

        const project = await projectRepository.create(projectPayload);
        
        return {
            project: {
                id: project._id,
                title: project.title,
                slug: project.slug,
                description: project.description,
                thumbnailUrl: project.thumbnailUrl,
                demoVideoUrl: project.demoVideoUrl,
                level: project.level,
                technologies: project.technologies,
                price: project.price,
                discountPrice: project.discountPrice || null,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                author: { id: userId },
                isBundleItem: project.isBundleItem,
                learningPack: learningPackId ? { id: learningPackId } : null,
                tags: tagIds,
            },
        };    
    } catch (error) {
    throw error;
    }
}