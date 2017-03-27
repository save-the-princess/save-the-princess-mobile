"use strict";

let frameModule = require("ui/frame");
let Account = require("../../view-models/account-view-model").AccountViewModel;

let page;
let account = new Account();

let signIn = (user) => {
  account.signIn();
  let topmost = frameModule.topmost();
  topmost.navigate({
    moduleName: "views/map/map",
    clearHistory: true,
    animated: true,
    transition: {
      name: "flip"
    }
  });
  account = new Account();
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
