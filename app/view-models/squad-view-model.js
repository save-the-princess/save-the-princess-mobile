let firebase = require("nativescript-plugin-firebase");
let ObservableArray = require("data/observable-array").ObservableArray;

class SquadViewModel extends ObservableArray {
  constructor(objects) {
    super(objects);
  }

  empty() {
    while (this.length) { this.pop(); }
  }

  all() {
    return firebase.getCurrentUser().then((user) => {
      return firebase.query(
        (data) => {
          for (let key in data.value) {
            this.push(data.value[key]);
          }
        },
        "characters",
        {
          singleEvent: true,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: "uid"
          },
          range: {
            type: firebase.QueryRangeType.EQUAL_TO,
            value: user.uid
          }
        }
      );
    })
  }
}

module.exports = { SquadViewModel: SquadViewModel };
