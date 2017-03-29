let frame = require("ui/frame");
let _ = require("../../shared/utils");

let page;

let onLoad = (args) => {
  page = args.object;
};

let onAdd = () => {
  frame.topmost().navigate({
    moduleName: "views/new-character/new-character",
    animated: true,
    transition: {
      name: "slideLeft"
    }
  });
};

let SquadView = {
  onLoad: onLoad,
  onAdd: onAdd,
};
exports = _.extend(exports, SquadView);
