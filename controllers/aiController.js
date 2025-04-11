let GPT4js;
const getGpt4Js = require('gpt4js')
getGpt4Js().then(
    (gpt4js) => {
        GPT4js = gpt4js
    }
)


const handlePrompt = async (req, res) => {

    const {role, prompt} = req.body;

    if (!prompt) {
        return res.status(403).json({
            message: 'Please provide prompt',
        })
    }

    const messages = [
        {role: "system", content: role || null},
        {role: "user", content: prompt},
    ];

    const options = {
        provider: "Nextway",
        model: "gpt-3.5-turbo",
        // response_type: 'json',
        response_format: 'json',
    };

    const provider = await GPT4js.createProvider(options.provider);
    const text = await provider.chatCompletion(messages, options, (data) => {
        console.log(data);
    });

    res.status(200).json({
        message: text || 'No response'
    })

}

const generateImage = async (req, res) => {

    const options = {
        provider: "Dalle2",
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