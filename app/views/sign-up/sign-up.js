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
  let controller = frameModule.topmost().ios.controller;
  let navBar = controller.navigationBar;
  navBar.shadowImage = new UIImage();
  navBar.setBackgroundImageForBarMetrics(new UIImage(), UIBarMetrics.UIBarMetricsDefault);
};

exports.signUp = () => {
  account.signUp().then(signIn, alert);
};
