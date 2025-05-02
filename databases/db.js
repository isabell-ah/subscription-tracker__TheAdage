const mongoose = require('mongoose');
const { DB_URI, NODE_ENV } = require('../config/env');
if (!DB_URI) {
  throw new Error('Please define the MongoDB_URI');
}

const connectDb = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to database in ${NODE_ENV} mode`);
  } catch (err) {
    console.error('Error connecting to database', err);
    process.exit(1);
  }
};
module.exports = connectDb;
