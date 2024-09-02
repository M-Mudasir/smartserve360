const { EmailClient } = require("@azure/communication-email");
const { template } = require("../lang/template");
require('dotenv').config()

module.exports.sendEmail = async (body) => {
  try {
    const connectionString = process.env.ACS_CONNECTION_STRING;
    const client = new EmailClient(connectionString);
    const emailMessage = {
      senderAddress: process.env.ACS_SENDER_ADDRESS,
      content: {
        subject: "Account Creation Notification",
        html: template(body),
      },
      recipients: {
        to: [{ address: body?.email }],
      },
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();


  } catch (error) {
    console.log(error, "error");
    return;
  }
};




