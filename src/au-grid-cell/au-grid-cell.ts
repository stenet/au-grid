import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { IAuGridCell } from "../interfaces/au-grid-cell";
import { IAuGridSizeOptions } from "../interfaces/au-grid-size-options";
import { IAuGridManipulateOptions } from "../interfaces/au-grid-manipulate-options";
import { IAuGridManipulateInfo } from "../interfaces/au-grid-manipulate-info";

@autoinject
export class AuGridCell {
  constructor() {}

  @bindable cell: IAuGridCell;
  @bindable sizeOptions: IAuGridSizeOptions;
  @bindable manipulateOptions: IAuGridManipulateOptions;
  @bindable manipulateInfo: IAuGridManipulateInfo;

  @computedFrom("cell.width", "sizeOptions.columns")
  get width() {
    return (this.cell.width / this.sizeOptions.columns * 100) + "%";
  }
  
  @computedFrom("cell.height", "sizeOptions.cellHeight")
  get height() {
    return (this.cell.height * this.sizeOptions.cellHeight) + "px";
  }

  @computedFrom("cell.y", "sizeOptions.cellHeight", "manipulateInfo.currMouseTop")
  get top() {
    if (this.manipulateInfo && this.manipulateInfo.cell == this && this.manipulateInfo.dragging) {
      return (this.manipulateInfo.origTop
        - this.manipulateInfo.origMouseTop
        + this.manipulateInfo.currMouseTop) + "px";
    }

    return (this.cell.y * this.sizeOptions.cellHeight) + "px";
  }
  
  @computedFrom("cell.x", "sizeOptions.columns", "manipulateInfo.currMouseLeft")
  get left() {
    if (this.manipulateInfo && this.manipulateInfo.cell == this && this.manipulateInfo.dragging) {
      return (this.manipulateInfo.origLeft
      - this.manipulateInfo.origMouseLeft
      + this.manipulateInfo.currMouseLeft) + "px";
    }

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