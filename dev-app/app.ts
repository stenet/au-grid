import { autoinject } from "aurelia-framework";
import { IAuGridCell } from "resources";

@autoinject
export class App {
  constructor() {}

  cells: IAuGridCell[] = [{
    x: 0,
    y: 0,
    width: 6,
    height: 3,
    cellClass: "cell1",
    content: "Zelle 1"
  }, {
    x: 6,
    y: 0,
    width: 4,
    height: 1,
    cellClass: "cell2",
    content: "Zelle 2"
  },
  {
    x: 6,
    y: 3,
    width: 4,
    height: 10,
    cellClass: "cell1",
    content: "Zelle 3"
  }]
}
