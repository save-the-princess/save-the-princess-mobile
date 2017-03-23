let Observable = require("data/observable").Observable;

class AccountViewModel extends Observable {
  constructor(object) {
    super({
      username: "marco",
      email: "email",
      password: "password"
    });
  }
}

module.exports = { AccountViewModel: AccountViewModel };
