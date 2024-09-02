const lumie = require("lumie");
const express = require("express");
const path = require('path');
var bodyParser = require("body-parser");
var helmet = require("helmet");
require("dotenv").config();
const cors = require("cors");

// Set the port for the server to listen on
const PORT = process.env.PORT || 8000;

// app
const app = express();

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    fontSrc: ["'self'", "'unsafe-inline'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`],
    connectSrc: ["'self'"],
  },
}));

// Serve static files from the 'build' folder
app.use(express.static(path.join(__dirname,'view')));

lumie.load(app, {
  preURL: "api",
  verbose: true,
  ignore: ["*.spec", "*.action"],
  controllers_path: path.join(__dirname, "controllers"),
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// checkExpiryAndCreateNotification function
const checkExpiryAndCreateNotification = require('./helpers/expiryCron');

// AutomatedProcurement function
const {AutomatedProcurement} = require('./helpers/automationCron');
AutomatedProcurement();

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
