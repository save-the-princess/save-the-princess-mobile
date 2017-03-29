let firebase = require("nativescript-plugin-firebase");
let Observable = require("data/observable").Observable;

class CharacterViewModel extends Observable {
  constructor(object = {}) {
    super({
      name: object.name || "",
      biography: object.biography || "",
      avatar: object.avatar || "res://Characters/01",
      points: object.points || 0,
      availablePoints: object.availablePoints || 10,
      power: object.power || 0,
      skill: object.skill || 0,
      resistance: object.resistance || 0,
      armor: object.armor || 0,
      firePower: object.firePower || 0,
      currentHealthPoints: object.currentHealthPoints || 0,
      maxHealthPoints: object.maxHealthPoints || 0,
      currentMagicPoints: object.currentMagicPoints || 0,
      maxMagicPoints: object.maxMagicPoints || 0,
      experience: object.experience || 0,
    });
    this.usePoints();
    this.handlePropertyChangeEvents();
  }

  attributes() {
    return ["power", "skill", "resistance", "armor", "firePower"];
  }

  availableAvatars() {
    return ["res://Characters/01", "res://Characters/02", "res://Characters/03",
      "res://Characters/04", "res://Characters/05", "res://Characters/07",
      "res://Characters/08", "res://Characters/13", "res://Characters/42"];
  }

  save() {
    return this.beforeSave().then(
      firebase.push("/characters", this.toJSON()),
      (error) => { throw error; }
    );
  }

  avatarIsBig() {
    return this.avatar == "res://Characters/07";
  }

  beforeSave() {
    return Promise.all([
      this.calculate("healthPoints"), this.calculate("MagicPoints"),
      this.validatePresenceOf("name"), this.validatePointUsage()
    ]);
  }

  calculate(attribute) {
    return new Promise(() => {
      let healthPoints = this.get("resistance") * 5;
      this.set(`current${attribute}`, healthPoints);
      this.set(`max${attribute}`, healthPoints);
    });
  }

  validatePresenceOf(attribute) {
    return new Promise(() => {
      if (this.get(attribute) === "") {
        throw `Character should have a ${attribute}.`;
      }
    });
  }

  validatePointUsage() {
    return new Promise(() => {
      if (this.get("points") > this.get("availablePoints")) {
        throw "Points spent should not be more than the available.";
      }
    });
  }

  handlePropertyChangeEvents() {
    this.addEventListener(Observable.propertyChangeEvent, (changedData) => {
      this.ensureIntegerAttribute(changedData);
      this.usePoints();
    });
  }

  ensureIntegerAttribute(changedData) {
    let propertyName = changedData.propertyName.toString();
    if (this.attributes().indexOf(propertyName) >= 0) {
      this.set(propertyName, Math.round(changedData.value));
    }
  }

  usePoints() {
    this.set("points", this.attributes().reduce((a, e) => {
      return a + this[e];
    }, 0));
  }

  toJSON() {
    return {
      name: this.get("name"),
      biography: this.get("biography"),
      points: this.get("points"),
      availablePoints: this.get("availablePoints"),
      power: this.get("power"),
      skill: this.get("skill"),
      resistance: this.get("resistance"),
      armor: this.get("armor"),
      firePower: this.get("firePower"),
      currentHealthPoints: this.get("currentHealthPoints"),
      maxHealthPoints: this.get("maxHealthPoints"),
      currentMagicPoints: this.get("currentMagicPoints"),
      maxMagicPoints: this.get("maxMagicPoints"),
      experience: this.get("experience"),
    };
  }
}

module.exports = { CharacterViewModel: CharacterViewModel }
