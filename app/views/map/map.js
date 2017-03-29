require("nativescript-status-bar").hide();

let geolocation = require("nativescript-geolocation");
let buttonModule = require("ui/button");
let frameModule = require("ui/frame");
let secrets = require("../../config/secrets");
let Observable = require("data/observable").Oservable;
let DungeonViewModel = require("../../view-models/dungeon-view-model").DungeonViewModel;
let firebase = require("nativescript-plugin-firebase");
let timer = require("timer");

let userLocation = { latitude: 0, longitude: 0, mapboxApiKey: secrets.mapboxApiKey, currentDungeon: (new DungeonViewModel()) };
let page;
let map;
let dungeons;

let hideCard = () => {
  let view = page.getViewById("dungeon_card");
  let fab = page.getViewById("fab");
  if (view.opacity === 0) { return Promise.resolve(); }
  fab.off("tap");
  return view.animate({ translate: { y: 0, x: 0 } }).then(
    () => {
      fab.animate({ backgroundColor: "#822428", rotate: -360 }).then(
        () => {
          fab.text = String.fromCharCode("0xf101");
          fab.color = "#000000";
          fab.animate({ backgroundColor: "#FFFFFF", rotate: -720, opacity: 0.75 }).then(
            () => {
              fab.on("tap", showMenu);
              fab.rotate = 0;
            }
          );
        }
      );
      view.animate({ translate: { y: 200, x: 0 }, opacity: 0 });
    }
  );
};

let delayedHideCard = () => {
  page.isDungeonTapped = false;
  return new Promise((resolve) => { timer.setTimeout(resolve, 100); })
               .then(() => { if (!page.isDungeonTapped) { hideCard(); } });
};

let startRaid = () => {
  let topmost = frameModule.topmost();
  topmost.navigate({
    moduleName: "views/new-raid/new-raid",
    animate: true,
    transition: {
      name: "slideBottom"
    }
  });
}

let showCard = () => {
  let view = page.getViewById("dungeon_card");
  let fab = page.getViewById("fab");
  fab.off("tap");
  return hideMenu().then(
    () => {
      view.animate({ translate: { y: 200, x: 0 }, duration: 0 }).then(
        () => {
          fab.animate({ backgroundColor: "#822428", rotate: 360 }).then(
            () => {
              fab.text = String.fromCharCode("0xf100");
              fab.color = "#FFFFFF";
              fab.animate({ backgroundColor: "#E84855", rotate: 720 }).then(
                () => {
                  fab.on("tap", startRaid);
                  fab.rotate = 0;
                }
              );
            }
          );
          view.animate({ translate: { y: 0, x: 0 }, opacity: 1 });
        }
      )
    }
  );
}

let selectDungeon = (marker) => {
  page.isDungeonTapped = true;
  let view = page.getViewById("dungeon_card");
  let currentDungeon = dungeons[marker.id];
  if (view.opacity > 0 && userLocation.currentDungeon.get("name") === currentDungeon.name) {
    hideCard();
    return;
  }
  userLocation.currentDungeon.set("name", currentDungeon.name);
  userLocation.currentDungeon.set("description", currentDungeon.description);
  showCard();
};

let gotoCreateDungeon = (args) => {
  let navigationEntry = {
    moduleName: "views/new-dungeon/new-dungeon",
    context: page.bindingContext
  };
  frameModule.topmost().navigate(navigationEntry);
};

let setCenterInUserLocation = (location) => {
  userLocation.latitude = location.latitude;
  userLocation.longitude = location.longitude;
  map.setCenter({ lat: location.latitude, lng: location.longitude });
};

let loadDungeons = () => {
  let markers = [];
  DungeonViewModel.all().then(
    (data) => {
      dungeons = data.value;
      for (let key in dungeons) {
        let dungeon = dungeons[key];
        markers.push({
          id: key,
          lat: dungeon.latitude,
          lng: dungeon.longitude,
          icon: "res://Markers/Castle",
          onTap: selectDungeon
        });
      }
      map.addMarkers(markers);
    }
  );
}

exports.onNavigatingTo = (args) => {
  map = map || args.map;
  loadDungeons();
};

exports.loaded = (args) => {
  page = args.object;
  page.bindingContext = userLocation;
};

exports.mapReady = (args) => {
  map = args.map;
  geolocation.getCurrentLocation()
    .then(setCenterInUserLocation)
};

exports.logout = (args) => {
  let topmost = frameModule.topmost();
  firebase.logout();
  topmost.navigate({
    moduleName: "views/sign-in/sign-in",
    clearHistory: true,
    animated: true,
    transition: {
      name: "flip"
    }
  });
};

let hideMenu = () => {
  let button = page.getViewById("fab");
  let menu = page.getViewById("floating_menu");
  if (!page.isMenuOpen) { return Promise.resolve(); }

  page.isMenuOpen = false;
  return button
    .animate({ rotate: -360 })
    .then(() => {
      button.rotate = 0;
      menu.animate({ opacity: 0 });
  });
}

let showMenu = (args) => {
  let button = args.object;
  let menu = page.getViewById("floating_menu");

  if (page.isMenuOpen) {
    hideMenu();
    return;
  }
  page.isMenuOpen = true;
  return button
    .animate({ rotate: 360 })
    .then(() => {
      button.rotate = 0;
      menu.animate({ opacity: 1 });
  });
}

let gotoSquad = () => {
  frameModule.topmost().navigate({
    moduleName: "views/squad/squad",
    animated: true,
    transition: {
      name: "slideLeft"
    }
  });
};

exports.gotoCreateDungeon = gotoCreateDungeon;
exports.delayedHideCard = delayedHideCard;
exports.showMenu = showMenu;
exports.startRaid = startRaid;
exports.gotoSquad = gotoSquad;
