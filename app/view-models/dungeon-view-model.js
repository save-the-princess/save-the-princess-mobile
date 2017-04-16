let firebase = require("nativescript-plugin-firebase");
let Observable = require("data/observable").Observable;
let ObservableArray = require("data/observable-array").ObservableArray;

class DungeonViewModel extends Observable {
  constructor(object = {}) {
    super({
      name: object.name || "",
      description: object.description || "",
      latitude: object.latitude || 0,
      longitude: object.longitude || 0,
      availableMonsters: object.availableMonsters || [],
      icon: "res://Markers/Castle",
      monsters: []
    });
  }

  randomizePositionInRadius(maxRadius) {
    let radians = Math.random() * 2 * Math.PI;
    this.latitude += maxRadius * Math.sin(radians);
    this.longitude += maxRadius * Math.cos(radians);
  }

  save() {
    return firebase.push(
            "dungeons",
            {
              name: this.get("name"),
              description: this.get("description"),
              latitude: this.get("latitude"),
              longitude: this.get("longitude"),
              monsters: this.get("monsters")
            }
          );
  }

  static all() {
    return firebase.query(
            (data) => { },
            "dungeons",
            {
              singleEvent: true,
              orderBy: {
                type: firebase.QueryOrderByType.CHILD,
                value: "name"
              }
            }
          );
  }
}

module.exports = { DungeonViewModel: DungeonViewModel };
