"use strict";

let frameModule = require("ui/frame");

var page;

exports.loaded = (args) => {
  page = args.object;
};

exports.signUp = () => {
  alert("Sign up user here");
};
