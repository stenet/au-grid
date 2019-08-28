import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { IAuGridCell } from "../interfaces/au-grid-cell";
import { IAuGridSizeOptions } from "../interfaces/au-grid-size-options";
import { IAuGridManipulateOptions } from "interfaces/au-grid-manipulate-options";

@autoinject
export class AuGridCell {
  constructor() {}

  @bindable cell: IAuGridCell;
  @bindable sizeOptions: IAuGridSizeOptions;
  @bindable manipulateOptions: IAuGridManipulateOptions;

  @computedFrom("cell.width", "sizeOptions.columns")
  get width() {
    return Math.floor(this.cell.width / this.sizeOptions.columns * 100) + "%";
  }
  
  @computedFrom("cell.height", "sizeOptions.cellHeight")
  get height() {
    return (this.cell.height * this.sizeOptions.cellHeight) + "px";
  }

  @computedFrom("cell.y", "sizeOptions.cellHeight")
  get top() {
    return (this.cell.y * this.sizeOptions.cellHeight) + "px";
  }
  
  @computedFrom("cell.x", "sizeOptions.columns")
  get left() {
    return (1 / this.sizeOptions.columns * this.cell.x * 100) + "%";
  }

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
}