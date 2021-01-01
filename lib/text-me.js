import twilioImport from "twilio";
const twilio = twilioImport(process.env.accountSid, process.env.authToken);

export const textMe = (message) => {
  twilio.messages.create({
    body: message,
    from: process.env.TWILIO_NUMBER,
    to: process.env.MY_NUMBER,
  });
};
