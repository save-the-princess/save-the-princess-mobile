// require("./bundle-config");
var application = require("application");
var firebase = require("nativescript-plugin-firebase");

firebase.init();
application.start({ moduleName: "views/sign-in/sign-in" });
