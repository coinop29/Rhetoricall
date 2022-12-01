const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken)


const initTwilio = () => {
  return client.messages.list({limit: 100});
}

module.exports = {
  initTwilio
};