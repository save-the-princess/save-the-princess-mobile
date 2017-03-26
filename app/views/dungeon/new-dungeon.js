let DungeonViewModel = require("../../view-models/dungeon-view-model").DungeonViewModel;

let page;
let dungeon;

exports.onNavigatingTo = (args) => {
  page = args.object;
  dungeon = new DungeonViewModel({
    latitude: page.navigationContext.latitude + 0.000250,
    longitude: page.navigationContext.longitude + 0.000250
  });
  page.bindingContext = dungeon;
}

exports.tap = () => {
  dungeon.save();
}
