"use strict";

let frameModule = require("ui/frame");
let Account = require("../../view-models/account-view-model").AccountViewModel;

var page;
var account = new Account();

var signIn = (user) => {
  frameModule.topmost().goBack();
};

exports.loaded = (args) => {
  page = args.object;
  page.bindingContext = account;
};

exports.signUp = () => {
  account.signUp().then(signIn, alert);
};
