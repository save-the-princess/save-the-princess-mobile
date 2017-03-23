"use strict";

let frameModule = require("ui/frame");
let Account = require("../../view-models/account-view-model").AccountViewModel;

var account = new Account();
var page;

exports.loaded = (args) => {
  page = args.object;
  page.bindingContext = account;
};

exports.signIn = () => {
  let username = page.getViewById("username");
  let password = page.getViewById("password");
  alert("Signing in with username: " + username.text + " and password: " + password.text);
};

exports.signUp = () => {
  var topmost = frameModule.topmost();
  topmost.navigate("views/sign-up/sign-up");
}
