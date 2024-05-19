const mongoose = require("mongoose");

// Using the connection string and environment variables
const password = process.env.MONGODB_PASSWORD;  // Your password, ensure it's URL encoded if there are special characters
const username = process.env.MONGODB_USER;       // Your MongoDB username
const clusterUrl = process.env.CLUSTER_URL;
const dbName = process.env.MONGODB_DATABASE;    // Replace with your actual database name

// Ensure password is encoded in case there are special characters
const DB_URI = `mongodb://${username}:${encodeURIComponent(password)}@${clusterUrl}/${dbName}?ssl=true&replicaSet=atlas-rygyob-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

const connectToMongo = () => {
  mongoose.connect(DB_URI)
  .then(() => {
    console.log("Database connected successfully");
  }).catch(err => {
    console.error("Database connection error: ", err);
  });
};

module.exports = connectToMongo;
