let _ = require("lodash");
let frame = require("ui/frame");
let observableModule = require("data/observable");
let SquadViewModel = require("../../view-models/squad-view-model").SquadViewModel;

let page;
let squad = new SquadViewModel([]);
let pageData = new observableModule.fromObject({
  squad: squad
});

let load = (args) => {
  page = args.object;
  page.bindingContext = pageData;
  squad.empty();
  pageData.set("isLoading", true);
  squad.all().then(
    () => {
      let squadView = page.getViewById("squad");
      squadView.animate({ opacity: 0.75 });
      pageData.set("isLoading", false);
    },
    (error) => {
      alert(error)
    }
  );
};

let add = () => {
  frame.topmost().navigate({
    moduleName: "views/new-character/new-character",
    animated: true,
    transition: {
      name: "slideLeft"
    }
  });
};

let SquadView = {
  onLoad: load,
  onAdd: add
};

exports = _.extend(exports, SquadView);
