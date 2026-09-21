import * as Joi from 'joi';

export const databaseSchema = Joi.object({
  DATABASE__HOST: Joi.string().required(),
  DATABASE__PORT: Joi.string().required(),
  DATABASE__USER: Joi.string().required(),
  DATABASE__PASSWORD: Joi.string().required(),
  DATABASE__NAME: Joi.string().required(),
});

export const globalSchema = Joi.object({
  TWITCH__OAUTH_CLIENT_ID: Joi.string().required(),
  TWITCH__OAUTH_CLIENT_SECRET: Joi.string().required(),
  TWITCH__OAUTH_REDIRECT_URI: Joi.string().required(),

  TWITCH__CHANNEL: Joi.string().required(),
  TWITCH__PREFIX: Joi.string().default('!'),
}).concat(databaseSchema);
