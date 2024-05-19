const mongoose = require("mongoose");

const password = process.env.MONGODB_PASSWORD;  
const username = process.env.MONGODB_USER;       
const clusterUrl = process.env.CLUSTER_URL;
const dbName = process.env.MONGODB_DATABASE;    

const DB_URI = `mongodb://${username}:${encodeURIComponent(password)}@${clusterUrl}/${dbName}?ssl=true&replicaSet=atlas-rygyob-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

const connectToMongo = () => {
  mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Database connected successfully");
  }).catch(err => {
    console.error("Database connection error: ", err);
  });
};

module.exports = connectToMongo;
