require("nativescript-status-bar").hide();

let geolocation = require("nativescript-geolocation");
let buttonModule = require("ui/button");
let frameModule = require("ui/frame");
let secrets = require("../../config/secrets");
let Observable = require("data/observable").Oservable;
let DungeonViewModel = require("../../view-models/dungeon-view-model").DungeonViewModel;

let userLocation = { latitude: 0, longitude: 0, mapboxApiKey: secrets.mapboxApiKey, currentDungeon: (new DungeonViewModel()) };
let page;
let map;
let dungeons;

let hideCard = () => {
  let view = page.getViewById("dungeon_card");
  let fab = page.getViewById("fab");
  return view.animate({ translate: { y: 0, x: 0 } }).then(
    () => {
      fab.animate({ backgroundColor: "#294488", rotate: -360 }).then(
        () => {
          fab.text = String.fromCharCode("0xf101");
          fab.color = "#000000";
          fab.animate({ backgroundColor: "#FFFFFF", rotate: -720, opacity: 0.75 });
        }
      );
      view.animate({ translate: { y: 200, x: 0 }, opacity: 0 });
    }
  );
}

let showCard = () => {
  let view = page.getViewById("dungeon_card");
  let fab = page.getViewById("fab");
  return view.animate({ translate: { y: 200, x: 0 }, duration: 0 }).then(
    () => {
      fab.animate({ backgroundColor: "#294488", rotate: 360 }).then(
        () => {
          fab.text = String.fromCharCode("0xf100");
          fab.color = "#FFFFFF";
          fab.animate({ backgroundColor: "#5988FF", rotate: 720 });
        }
      );
      view.animate({ translate: { y: 0, x: 0 }, opacity: 1 });
    }
  );
}

let selectDungeon = (marker) => {
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

let tap = (args) => {
  let button = args.object;
  let navigationEntry = {
    moduleName: "views/new-dungeon/new-dungeon",
    context: page.bindingContext
  };
  button
    .animate({ rotate: 380, duration: 300 })
    .then(() => {
      button.rotate = 0;
      setTimeout(() => {
        frameModule.topmost().navigate(navigationEntry);
      }, 200);
  });
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

exports.tap = tap;
