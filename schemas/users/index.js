const Joi = require("joi");

const verifySchema = Joi.object({
  email: Joi.string().required(),
});

module.exports = { verifySchema };
