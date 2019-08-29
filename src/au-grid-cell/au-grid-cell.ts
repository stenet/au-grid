import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { IAuGridCell } from "../interfaces/au-grid-cell";
import { IAuGridManipulateInfo } from "../interfaces/au-grid-manipulate-info";

@autoinject
export class AuGridCell {
  constructor() {}

  @bindable cell: IAuGridCell;
  @bindable padding: number;
  @bindable canResize: boolean;
  @bindable manipulateInfo: IAuGridManipulateInfo;

  @computedFrom("cell.cellClass", "manipulateInfo.cell", "manipulateInfo.hasMoved")
  get cellClass() {
    const classes = [];
    
    if (this.cell.cellClass) {
      classes.push(this.cell.cellClass);
    }

    if (this.manipulateInfo && this.manipulateInfo.cell == this && this.manipulateInfo.hasMoved) {
      classes.push("au-grid-cell-manipulate");
    }

    return classes.join(" ");
  }
}