let frame = require("ui/frame");
let DungeonViewModel = require("../../view-models/dungeon-view-model").DungeonViewModel;

let page;
let dungeon;

exports.onNavigatingTo = (args) => {
  page = args.object;
  dungeon = new DungeonViewModel({
    latitude: page.navigationContext.latitude,
    longitude: page.navigationContext.longitude
  });
  page.bindingContext = dungeon;
}

exports.onDone = () => {
  dungeon.randomizePositionInRadius(0.000275);
  dungeon.save().then(() => {
    let topmost = frame.topmost();
    topmost.goBack();
  });
}
