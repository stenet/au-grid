import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { IAuGridCell } from "../interfaces/au-grid-cell";
import { IAuGridManipulateOptions } from "../interfaces/au-grid-manipulate-options";
import { IAuGridManipulateInfo } from "../interfaces/au-grid-manipulate-info";

@autoinject
export class AuGridCell {
  constructor() {}

  @bindable cell: IAuGridCell;
  @bindable manipulateOptions: IAuGridManipulateOptions;
  @bindable manipulateInfo: IAuGridManipulateInfo;

  @computedFrom("manipulateOptions.canMove", "cell.manipulateOptions.canMove")
  get canMove() {
    return this.manipulateOptions.canMove
      && (!this.cell.manipulateOptions || this.cell.manipulateOptions.canMove);
  }

  @computedFrom("manipulateOptions.canResize", "cell.manipulateOptions.canResize")
  get canResize() {
    return this.manipulateOptions.canResize
      && (!this.cell.manipulateOptions || this.cell.manipulateOptions.canResize);
  }  

  @computedFrom("cell.cellClass", "manipulateInfo.cell")
  get cellClass() {
    const classes = [];
    
    if (this.cell.cellClass) {
      classes.push(this.cell.cellClass);
    }

    if (this.manipulateInfo && this.manipulateInfo.cell == this) {
      classes.push("au-grid-cell-manipulate");
    }

    return classes.join(" ");
  }
}