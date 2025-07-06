const Project = require('../models/projectModel')
const {v4: uuidv4} = require('uuid')

const createProject = async (req, res) => {

    const {name, description, origin} = req.body
    const normalizedOrigin = origin.trim().toLowerCase().replace(/\/$/, '');

    const api_key = uuidv4().replace(/-/g, '')
    const user = req.user;

    // Checking number of projects user has created
    const userProjects = await Project.find({userId: user.id})

    // Finds if project exists per user
    const isProjectExisting =
        await Project.findOne({origin: normalizedOrigin, userId: user.id})

    if (isProjectExisting) {
        return res.status(409).json({
            message: 'You already have a project using this origin.',
            project: isProjectExisting,
        })
    }

    if (userProjects.length === 5) {
        return res.status(400).json({
            message: '5 is the maximum number of projects allowed',
            projects: userProjects
        })
    }

    const project = new Project({
        name,
        description,
        origin: normalizedOrigin,
        api_key,
        userId: user.id,
    })

    const newProject = await project.save()
    res.status(201).json({
        message: 'Project created successfully',
        project: newProject,
    })
}

// Get all projects
const getAllProjects = async (req, res) => {
    const user = req.user;
    const allProjects = await Project.find({userId: user.id})
    res.status(200).json({
        message:  `Fetched all projects owned by ${user.name}`,
        projects: allProjects
    })
}

// Get project by id
const getProjectById = async (req, res) => {
    const {id} = req.params
    const project = await Project.findOne({_id: id})

    if (!project) {
        return res.status(404).json({
            message: 'Project with this id does not exist',
        })
    }

    res.status(200).json({
        message: 'Project fetched successfully',
        project: project,
    })
}

const deleteProjectById = async (req, res) => {
    const {id} = req.params
    const project = await Project.findOne({_id: id})

    if (!project) {
        return res.status(404).json({
            message: 'Project with this id does not exist',
        })
    }

    if (project) {
        await Project.deleteOne({_id: id})
        return res.status(200).json({
            message: 'Project deleted successfully',
        })
    }
}


module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    deleteProjectById,
}