let Observable = require("data/observable").Observable;
let firebase = require("nativescript-plugin-firebase");

class AccountViewModel extends Observable {
  constructor(object) {
    super({
      name: "marco",
      email: "marco@example.com",
      password: "password"
    });
  }

  signIn() {
    firebase
      .login({
        type: firebase.LoginType.PASSWORD,
        email: this.email,
        password: this.password
      })
      .then(
        (user) => {
          console.log("user.uid: " + user.uid)
        },
        (error) => {
          alert(error);
        }
      );
  }

  signUp() {
    firebase
      .createUser({
        name: this.name,
        email: this.email,
        password: this.password
      })
      .then(
        (user) => {
          console.log("I was able to create an user");
        },
        (error) => {
          alert(error);
        }
      );
  }
}

module.exports = { AccountViewModel: AccountViewModel };
