if (global.TNS_WEBPACK) {
    //registers tns-core-modules UI framework modules
    require("bundle-entry-points");

    //register application modules
    global.registerModule("save-the-princess-utils", function () { return require("./shared/save-the-princess-utils"); });
}
