import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { IAuGridCell } from "../interfaces/au-grid-cell";
import { IAuGridSizeOptions } from "../interfaces/au-grid-size-options";
import { IAuGridManipulateOptions } from "../interfaces/au-grid-manipulate-options";

@autoinject
export class AuGrid {
  constructor() {}

  @bindable cells: IAuGridCell[];
  @bindable sizeOptions: IAuGridSizeOptions = {
    cellHeight: 50,
    columns: 12
  }
  @bindable manipulateOptions: IAuGridManipulateOptions = {
    canMove: true,
    canResize: true
  }

  height: string;

  bind() {
    this.updateHeight();
  }

  updateHeight() {
    const height = this.calcHeight();

    this.height = height
      ? height + "px"
      : "20px";
  }  

  private calcHeight() {
    if (!this.cells) {
      return 0;
    }

    const heights = this.cells.map(c => c.y * this.sizeOptions.cellHeight + c.height * this.sizeOptions.cellHeight);
    return Math.max(...heights);
  }
}