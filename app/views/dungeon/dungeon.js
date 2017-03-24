let geolocation = require("nativescript-geolocation");
let buttonModule = require("ui/button");
let frameModule = require("ui/frame");
let secrets = require("../../config/secrets");
let DungeonViewModel = require("../../view-models/dungeon-view-model").DungeonViewModel;

let userLocation = { latitude: 0, longitude: 0, mapboxApiKey: secrets.mapboxApiKey };
let page;
let map;

let tap = (args) => {
  let button = args.object;
  let navigationEntry = {
    moduleName: "views/dungeon/new-dungeon",
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
}

let setCenterInUserLocation = (location) => {
  userLocation.latitude = location.latitude;
  userLocation.longitude = location.longitude;
  map.setCenter({ lat: location.latitude, lng: location.longitude });
};

let loadDungeons = () => {
  let markers = [];
  DungeonViewModel.all().then(
    (data) => {
      let dungeons = data.value;
      for (let key in dungeons) {
        let dungeon = dungeons[key];
        markers.push({ title: dungeon.name, lat: dungeon.latitude, lng: dungeon.longitude, subtitle: dungeon.description });
      }
      map.addMarkers(markers);
    }
  );
}

exports.loaded = (args) => {
  page = args.object;
  page.bindingContext = userLocation;
};

exports.mapReady = (args) => {
  map = args.map;
  geolocation.getCurrentLocation()
    .then(setCenterInUserLocation)
    .then(loadDungeons);
};

exports.tap = tap;
