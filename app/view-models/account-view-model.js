let Observable = require("data/observable").Observable;
let firebase = require("nativescript-plugin-firebase");

class AccountViewModel extends Observable {
  constructor(object = {}) {
    super({
      name: object.name || "",
      email: object.email || "",
      password: object.password || ""
    });
  }

  signIn() {
    return firebase.login({
             type: firebase.LoginType.PASSWORD,
             email: this.email,
             password: this.password
           });
  }

  signUp() {
    return firebase.createUser({
             name: this.name,
             email: this.email,
             password: this.password
           });
  }
}

module.exports = { AccountViewModel: AccountViewModel };
