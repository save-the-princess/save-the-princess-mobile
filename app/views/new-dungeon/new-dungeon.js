let frame = require("ui/frame");
let DungeonViewModel = require("../../view-models/dungeon-view-model").DungeonViewModel;
let Monster = require("../../models/monster").Monster;

let page;
let dungeon;

exports.onNavigatingTo = (args) => {
  page = args.object;
  Monster.all().then((monsters) => {
    let availableMonsters = []
    for (let key in monsters.value) {
      availableMonsters.push(new Monster(monsters.value[key]));
    }
    dungeon = new DungeonViewModel({
      latitude: page.navigationContext.latitude,
      longitude: page.navigationContext.longitude,
      availableMonsters: availableMonsters
    });
    page.bindingContext = dungeon;
  });
}

exports.onDone = () => {
  let picker = page.getViewById("monster_picker");
  dungeon.set("monsters", [dungeon.availableMonsters[picker.selectedIndex]]);
  dungeon.randomizePositionInRadius(0.000825);
  dungeon.save().then(() => {
    let topmost = frame.topmost();
    topmost.goBack();
  });
}
