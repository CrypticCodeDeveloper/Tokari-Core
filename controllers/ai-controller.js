let GPT4js;
const getGpt4Js = require("gpt4js");
getGpt4Js().then((gpt4js) => {
  GPT4js = gpt4js;
});

const ApiCall = require("../models/api-call-model");
const User = require("../models/user-model")

const {encode} = require("gpt-tokenizer/model/gpt-3.5-turbo")

const handlePrompt = async (req, res) => {
  const { role, prompt } = req.body;

  const messages = [
    { role: "system", content: role || "You are a helpful assistant" },
    { role: "user", content: prompt },
  ];

  const options = {
    provider: "Nextway",
    model: "gpt-3.5-turbo",
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const user = await User.findOne({ apiKey: req.headers["x-api-key"] })
  const tokens = encode(prompt)
  console.log("tokens: ", tokens)

  try {
    const provider = await GPT4js.createProvider(options.provider);
    const response = await provider.chatCompletion(
      messages,
      options,
      (data) => {
        console.log(data);
      }
    );

    // update if successful
    await ApiCall.updateOne(
      {
        userId: user._id,
        apiKey: req.headers["x-api-key"],
        year: year,
        month: month,
      },
      {
        $inc: {
          api_calls: 1,
          tokens_used: tokens[0],
          tokens_cost: (tokens[0] / 1000) * 0.002,
          success_calls: 1,
        },
        origin: req.headers["origin"] || "Unknown",
      },
      {
        upsert: true,
        new: true,
      }
    );

    return res.status(200).json({
      response,
    });
  } catch (error) {
    // Update if failed
    await ApiCall.updateOne(
      {
        userId: user._id,
        apiKey: req.headers["x-api-key"],
        year: year,
        month: month,
      },
      {
        $inc: {
          api_calls: 1,
          tokens_used: 0,
          tokens_cost: 0,
          failed_calls: 1,
        },
        origin: req.headers["origin"] || "Unknown",
      },
      {
        upsert: true,
        new: true,
      }
    );

    return res.status(500).json({
      error: "An error occurred while processing your request.",
      details: error.message,
    });
  }
};

const generateImage = async (req, res) => {
  const options = {
    provider: "StableDiffusion",
  };

  const provider = GPT4js.createProvider(options.provider);

  const base64 = await provider.imageGeneration("wood", options);
  console.log(base64);

  res.status(200).json({
    message: "Generating image",
    base64,
  });
};

const getAiUsage = async (req, res) => {

    const stats = await ApiCall.find({
        userId: req.user.id,
    }).sort({month: -1})

    res.status(200).json({
        stats,
    })

}

module.exports = {
  handlePrompt,
  generateImage,
  getAiUsage
}


