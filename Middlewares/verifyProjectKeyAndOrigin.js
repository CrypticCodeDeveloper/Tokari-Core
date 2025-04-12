const Project = require('../models/projectModel')

const verifyProjectKeyAndOrigin = async (req, res, next) => {
    const apiKey = req.headers['x-api-key']
    const isProjectExisting = await Project.findOne({apiKey})
    const protocol = req.protocol;
    const host = req.headers['host'];

    const origin = `${protocol}://${host}`;

    if (!apiKey) {
        return res.status(403).json({
            message: "Api key does not exist in request header"
        })
    }

    if (!isProjectExisting) {
        return res.status(404).json({
            message: "Invalid api key"
        })
    }

    if (isProjectExisting.origin !== origin) {
        return res.status(403).json({
            message: `${origin} is not associated with this project`
        })
    }

    next()

}

module.exports = verifyProjectKeyAndOrigin