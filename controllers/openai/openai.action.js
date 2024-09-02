const db = require("../../models/index");
const { Sequelize } = require("sequelize");

const generateSqlagentResponse = require("../../helpers/generate-sqlagent-response.js")
const generateSqlagentTableResponse = require("../../helpers/generate-sqlagenttable-response.js");
require("dotenv").config();

module.exports.generateInstruction = async (req, res) => {
  try {
    const { body } = req;

    const openaiRequestBody = {
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that gives step-by-step procedures of making a dish/recipie based on user query. Your response must not contain of anything else then the steps to creating a dish/recipe",
        },
        {
          role: "user",
          content: body.query + "please keep the steps in a comma seprated text, as I'm using the format somewhere else to catch this"
        },
      ]
    };
    const response = await fetch(process.env.AZURE_OPENAI_DEPLOYMENT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_OPENAI_API_KEY,
      },
      body: JSON.stringify(openaiRequestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.send({ message: errorText });
    }

    const parsedResponse = await response.json();
    const message = parsedResponse.choices[0].message.content

    return res.send({ message: message });
  } catch (err) {
    if (err.message.includes("Cannot read properties of null (reading 'map')")) {
      return res.send({ message: "Sorry, I was not able to create a recipe for that. Please try again." });
    }
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports.generateAdminResponse = async (req, res) => {
  try {
    const { body } = req;
    const response = await generateSqlagentResponse(body?.query)
    return res.send({ response: { "message": response } });
  } catch (err) {
    console.log(err);
    return res
      .send({ response: { "message": 
      "Sorry! Agent couldn't find any response for your respective query.\nThis version is currently training on your data.\nIntend to respond to your query in future.\nThankyou\nSmartServe AI" } });
  }
};

module.exports.generateSQLAgent = async (req, res) => {
  try {
    const {body} = req
    const query = await generateSqlagentTableResponse(body?.query)
    const conn = db.sequelize
    const response = await conn.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return res.send({ response });
  } catch (err) {
    console.log(err.message);
    return res.send({ response: [{ "AI Agent": "Sorry! Agent couldn't find any response for your respective query.\nThis version is currently training on your data.\nIntend to respond to your query in future.\nThankyou\nSmartServe AI" }] });
  }
};
