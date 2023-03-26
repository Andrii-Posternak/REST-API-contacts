const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const schemaFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemaQuery = Joi.object({
  favorite: Joi.boolean().valid(true),
  page: Joi.number().integer().positive(),
  limit: Joi.number().integer().positive(),
});

module.exports = { schema, schemaFavorite, schemaQuery };
