const {update} = require("./update.js");
const {view} = require("./view.js");
const {app} = require("./app.js");
const {initModel} = require("./model.js");
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
