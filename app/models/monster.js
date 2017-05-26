let firebase = require("nativescript-plugin-firebase");
let Observable = require("data/observable").Observable;

class Monster extends Observable {
  constructor(objects) {
    super(objects);
  }

  static all() {
    return firebase
      .query(
        (data) => {
          for (let key in data.value) {
            new Monster(data.value[key]);
          }
        },
        "monsters",
        {
          singleEvent: true,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: "name"
          }
        }
      );
  }

  isAlive() {
    return this.healthPoints > 0;
  }

  toString() {
    return this.get("name");
  }
}

module.exports = { Monster: Monster };
