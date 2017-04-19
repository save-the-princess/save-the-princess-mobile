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

let SquadView = {
  onNavigatingTo: load,
  onChoosingCharacter: gotoChooseCharacter
};

exports = _.extend(exports, SquadView);
