require("dotenv").config();
const twilio = require("twilio")(process.env.accountSid, process.env.authToken);
const fs = require("fs");
const prompt = require("prompt-sync")();

const textMe = (message) => {
  twilio.messages.create({
    body: message,
    from: process.env.TWILIO_NUMBER,
    to: process.env.MY_NUMBER,
  });
};

module.exports = { textMe };
