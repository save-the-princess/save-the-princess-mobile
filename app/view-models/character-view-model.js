let firebase = require("nativescript-plugin-firebase");
let Observable = require("data/observable").Observable;

class CharacterViewModel extends Observable {
  constructor(object = {}) {
    super({
      name: object.name || "",
      biography: object.biography || "",
      avatar: object.avatar || "res://Characters/01",
      points: object.points || 10,
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
      uid: object.uid
    });
    this.errors = [];
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
    this.beforeSave()
    if (!this.get("errors").length) {
      return firebase
               .getCurrentUser()
               .then(
                 (user) => {
                   let json = this.toJSON();
                   json.uid = user.uid;
                   return json;
                 }
               )
               .then((json) => {
                   return firebase.push("characters", json);
                 }
               );
    } else {
      return Promise.reject(this.get("errors")[0]);
    }
  }

  isAlive() {
    return this.healthPoints > 0;
  }

  avatarIsBig() {
    return this.avatar == "res://Characters/07";
  }

  beforeSave() {
    this.errors = [];
    this.calculate("HealthPoints");
    this.calculate("MagicPoints");
    this.validatePresenceOf("name");
    this.validatePointUsage();
  }

  calculate(attribute) {
    let healthPoints = this.get("resistance") * 5;
    this.set(`current${attribute}`, healthPoints);
    this.set(`max${attribute}`, healthPoints);
    return true;
  }

  validatePresenceOf(attribute) {
    if (this.get(attribute) === "") {
      this.errors.push("Name should not be empty.");
      return false;
    }
    return true;
  }

  validatePointUsage() {
    if (this.get("availablePoints") < 0) {
      this.errors.push("Available points should not be below 0.");
      return false;
    }
    return true;
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
    this.set("availablePoints", this.attributes().reduce((a, e) => {
      return a - this[e];
    }, this.get("points")));
  }

  toJSON() {
    return {
      name: this.get("name"),
      biography: this.get("biography"),
      avatar: this.get("avatar"),
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
