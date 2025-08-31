const mongoose = require("mongoose");
const initData = require("./data.js");
const list = require("../models/listings.js");

main()
  .then(() => {
    console.log("connected to mongoDb");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initDb = async () => {
  await list.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner:  "68a21f96c015e09b10cd1d84" }));
  await list.insertMany(initData.data);
};
initDb();
