# Save The Princess

Simple Augmented Reality game that allow users to create characters and send them to battles.

## Installation

First, make sure that you have NativeScript installed in your computer.

Then create a Mapbox API key and add it to the `app/config/secrets.js` file. It should look like this.

```js
module.exports = {
  mapboxApiKey: "YOUR_MAPBOX_API_KEY_HERE"
}
```

Then create a Firebase App and add the configuration file (GoogleService-Info.plist) to the folder `app/App_Resource/iOS`.

Then just run in the terminal:

```js
$ tns run ios --emulator
```

And the emulator will run the game.
