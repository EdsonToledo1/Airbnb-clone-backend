const { MongoClient } = require("mongodb");
const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME } = process.env;

const mongoURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(mongoURL);
let db;

const connectDB = async () => {
  if (db) {
    return db;
  }

  try {
    await mongoClient.connect();
    db = mongoClient.db(DB_NAME);
  } catch (err) {
    console.error(err);
    console.log("Uh-oh");
    process.exit(1);
  }

  return db;
};

module.exports = connectDB;
