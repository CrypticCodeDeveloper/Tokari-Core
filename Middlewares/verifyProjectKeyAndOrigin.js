const Project = require('../models/projectModel')

const verifyProjectKeyAndOrigin = async (req, res, next) => {
    const api_key = req.headers['x-api-key']
    const isProjectExisting = await Project.findOne({api_key}).populate("userId")
    const user = isProjectExisting.userId
    const protocol = req.protocol;
    const host = req.headers['host'];

    const origin = `${protocol}://${host}`;


    if (!api_key) {
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

    req.origin = origin
    console.log(user)
    req.user = user
    next()

}

module.exports = verifyProjectKeyAndOrigin