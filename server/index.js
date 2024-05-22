const express = require("express");
require("dotenv").config();
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');
const connectToMongo = require("./db/connection");

const app = express();
const port = process.env.NODE_LOCAL_PORT || 3000;


app.use(express.json());

app.use((req, res, next) => {
  console.log('Parsed Body: ', req.body);
  next();
});

// Setup routes
app.use('/admin', adminRoutes);
app.use('/customer', customerRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
