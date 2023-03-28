const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const mail = { ...data, from: "101dron101@gmail.com" };
  try {
    await sgMail.send(mail);
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEmail;
