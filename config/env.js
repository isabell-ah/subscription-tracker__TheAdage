// const dotenv = require('dotenv');
const { config } = require('dotenv');
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const port = process.env.PORT;
const DB_URI = process.env.DB_URI;
const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE_IN = process.env.JWT_EXPIRES_IN;
const ARCJET_ENV = process.env.ARCJET_ENV;
const ARCJET_KEY = process.env.ARCJET_KEY;
const QSTASH_URL = process.env.QSTASH_URL;
const QSTASH_TOKEN = process.env.QSTASH_TOKEN;
const SERVER_URL = process.env.SERVER_URL;
const QSTASH_CURRENT_SIGNING_KEY = process.env.QSTASH_CURRENT_SIGNING_KEY;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
module.exports = {
  port,
  DB_URI,
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRE_IN,
  ARCJET_ENV,
  ARCJET_KEY,
  QSTASH_URL,
  QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY,
  SERVER_URL,
  EMAIL_PASSWORD,
};
