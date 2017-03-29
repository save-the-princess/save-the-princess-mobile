// require("./bundle-config");
var application = require("application");
var firebase = require("nativescript-plugin-firebase");

firebase.init();
firebase.getCurrentUser().then((user) => {
  // application.start({ moduleName: "views/map/map" });
  application.start({ moduleName: "views/new-character/new-character" });
}, () => {
  application.start({ moduleName: "views/sign-in/sign-in" });
});
