require("nativescript-dom");
let _ = require("../../shared/utils");
let CharacterViewModel = require("../../view-models/character-view-model").CharacterViewModel;


let timer = require("timer");
let character = new CharacterViewModel({ name: "Marc", power: 3, skill: 3, resistance: 3, armor: 1 });

let page;

character.addEventListener(CharacterViewModel.propertyChangeEvent, (changedData) => {
  let alert = page.getViewById("available_points_alert");
  if (character.get("availablePoints") < character.get("points")) {
    alert.classList.add("alert-danger");
  } else {
    alert.classList.remove("alert-danger");
  }
});

let animateAvatar = () => {
  let sprite = page.getElementById("avatar");
  let index = 1;
  let animationSize = 4;
  timer.setInterval(() => {
    sprite.classList.remove(`avatar-idle-${index}`);
    if (index == animationSize) {
      sprite.classList.add("avatar-idle-1");
      return index = 1;
    }
    sprite.classList.add(`avatar-idle-${index + 1}`);
    index++
  }, 150);
}

let load = (args) => {
  page = args.object;
  page.bindingContext = character;
  animateAvatar();
}

let done = () => {
  return character.save().then(
    () => {
      console.log("ok");
    },
    (error) => {
      alert(error);
    }
  );
}

let showNextAvatar = () => {
  let avatar = page.getViewById("avatar").backgroundImage;
  let availableAvatars = character.availableAvatars();
  let index = availableAvatars.indexOf(avatar);
  if (index >= availableAvatars.length - 1) {
    character.set("avatar", availableAvatars[0]);
    return;
  }
  character.set("avatar", availableAvatars[index + 1]);
  handleBigAvatars();
}

let showPreviousAvatar = () => {
  let avatar = page.getViewById("avatar").backgroundImage;
  let availableAvatars = character.availableAvatars();
  let index = availableAvatars.indexOf(avatar);
  if (index <= 0) {
    character.set("avatar", availableAvatars[availableAvatars.length - 1]);
    return;
  }
  character.set("avatar", availableAvatars[index - 1]);
  handleBigAvatars();
}

let handleBigAvatars = () => {
  let avatar = page.getViewById("avatar");
  let bigClass = "avatar-big";
  character.avatarIsBig() ? avatar.classList.add(bigClass) : avatar.classList.remove(bigClass);
}

let NewCharacterView = {
  onLoad: load,
  onDone: done,
  onShowNextAvatar: showNextAvatar,
  onShowPreviousAvatar: showPreviousAvatar,
};

module.exports = NewCharacterView;
