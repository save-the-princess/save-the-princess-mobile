let _ = require("lodash");
let frame = require("ui/frame");
let observableModule = require("data/observable");
let SquadViewModel = require("../../view-models/squad-view-model").SquadViewModel;

let page;
let pageData;

let load = (args) => {
  page = args.object;
  let bindingContext = page.navigationContext;
  pageData = new observableModule.fromObject({
   dungeon: bindingContext.dungeon,
   monster: bindingContext.monster
  });
  page.bindingContext = pageData;
};

let closeCallback = (character) => {
  page.bindingContext.set("character", character);
  let view = page.getViewById("character");
  view.visibility = "visible";
}

let gotoChooseCharacter = () => {
  page.showModal(
    "views/choose-character/choose-character",
    page.bindingContext,
    closeCallback
  );
};

let startRaid = () => {
  frame.topmost().navigate({
    moduleName: "views/battle/battle",
    context: {
      character: page.bindingContext.character,
      monster: page.bindingContext.monster
    },
    transition: {
      name: "fade"
    }
  });
}

let NewRaidView = {
  onNavigatingTo: load,
  onChoosingCharacter: gotoChooseCharacter,
  onStartRaid: startRaid
};

exports = _.extend(exports, NewRaidView);
