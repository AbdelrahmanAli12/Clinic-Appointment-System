const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const url = process.env.CLUSTER;

async function establishDBConnection() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}
module.exports = {
  establishDBConnection,
};
