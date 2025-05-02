const { Client } = require('@upstash/workflow');
const { QSTASH_TOKEN, QSTASH_URL } = require('./env');

const workflowClient = new Client({
  token: QSTASH_TOKEN,
  baseUrl: QSTASH_URL,
});

module.exports = { workflowClient };