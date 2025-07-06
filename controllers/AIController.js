let GPT4js;
const getGpt4Js = require('gpt4js')
getGpt4Js().then(
    (gpt4js) => {
        GPT4js = gpt4js
    }
)

const Project = require("../models/projectModel")


const handlePrompt = async (req, res) => {

    const {role, prompt} = req.body;
    const user = req.user;
    const origin = req.origin;

    if (!prompt) {
        return res.status(403).json({
            message: 'Please provide prompt',
        })
    }

    const messages = [
        {role: "system", content: role || "You are a helpful assistant"},
        {role: "user", content: prompt},
    ];

    const options = {
        provider: "Nextway",
        model: "gpt-3.5-turbo",
    };

    const provider = await GPT4js.createProvider(options.provider);
    const response = await provider.chatCompletion(messages, options, (data) => {
        console.log(data);
    });

    await Project.findOneAndUpdate(
        {userId: user.id, origin},
        {
            $inc: {
                token_used: 6,
                requests: 1,
                monthly_cost: 0.05,
            }, $currentDate: {
                last_used: true,
            }
        })


    res.status(200).json({
        response,
    })

}

const generateImage = async (req, res) => {

    const options = {
        provider: "StableDiffusion",
    };

    const provider = GPT4js.createProvider(options.provider);

    const base64 = await provider.imageGeneration("wood", options);
    console.log(base64);

    res.status(200).json({
        message: 'Generating image',
        base64,
    })
}

module.exports = {
    handlePrompt,
    generateImage
}