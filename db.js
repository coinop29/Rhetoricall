const { MongoClient, ObjectId } = require("mongodb");
const connectionUrl = process.env.DB_URL;

const dbName = "sms";

global.db;

const init = () =>
  MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then(
    (client) => {
      db = client.db(dbName);
      console.log('mongodb server is connected');
    }
  );

const insertItem = (item) => {
  const collection = db.collection("items");
  console.log('add one item');
  return collection.insertOne(item);
};

const checkPhoneNumber = async (number) => {
  const collection = db.collection("items");
  const num = await collection.findOne({"from": number});
  console.log('records found ======>', num);

  return num != null;
};

module.exports = {
  init,
  insertItem,
  checkPhoneNumber
};
