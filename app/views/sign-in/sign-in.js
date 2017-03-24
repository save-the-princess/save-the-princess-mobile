"use strict";

require("nativescript-status-bar").hide();

let frameModule = require("ui/frame");
let Account = require("../../view-models/account-view-model").AccountViewModel;

var account = new Account({ email: "marco@example.com", password: "password" });
var page;

var successfulSignIn = (user) => {
  var topmost = frameModule.topmost();
  topmost.navigate({ moduleName: "views/dungeon/dungeon", clearHistory: true });
};

exports.loaded = (args) => {
  page = args.object;
  page.bindingContext = account;
};

exports.signIn = () => {
  account.signIn().then(successfulSignIn, alert);
};

exports.signUp = () => {
  var topmost = frameModule.topmost();
  topmost.navigate("views/sign-up/sign-up");
}
