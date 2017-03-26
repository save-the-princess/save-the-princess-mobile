let firebase = require("nativescript-plugin-firebase");
let Observable = require("data/observable").Observable;

class DungeonViewModel extends Observable {
  constructor(object = {}) {
    super({
      name: object.name || "",
      description: object.description || "",
      latitude: object.latitude || 0,
      longitude: object.longitude || 0
    });
  }

  save() {
    return firebase.push(
            "/dungeons",
            {
              name: this.get("name"),
              description: this.get("description"),
              latitude: this.get("latitude"),
              longitude: this.get("longitude")
            }
          );
  }

  static all() {
    return firebase.query(
            (data) => { },
            "/dungeons",
            {
              singleEvent: true,
              orderBy: {
                type: firebase.QueryOrderByType.CHILD,
                value: 'name'
              }
            }
          );
  }
}

module.exports = { DungeonViewModel: DungeonViewModel };
