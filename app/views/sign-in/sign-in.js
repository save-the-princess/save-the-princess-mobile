"use strict";

var page;

exports.loaded = (args) => {
  page = args.object;
};

exports.signIn = () => {
  let username = page.getViewById("username");
  let password = page.getViewById("password");
  alert("Signing in with username: " + username.text + " and password: " + password.text);
};
