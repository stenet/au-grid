import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { IAuGridCellPlaceholder } from "../interfaces/au-grid-cell-placeholder";
import { IAuGridSizeOptions } from "../interfaces/au-grid-size-options";

@autoinject
export class AuGridCellPlaceholder {
  constructor() {}

  @bindable sizeOptions: IAuGridSizeOptions
  @bindable placeholder: IAuGridCellPlaceholder;

  @computedFrom("placeholder.width", "sizeOptions.columns")
  get width() {
    return (this.placeholder.width / this.sizeOptions.columns * 100) + "%";
  }
  
  @computedFrom("placeholder.height", "sizeOptions.cellHeight")
  get height() {
    return (this.placeholder.height * this.sizeOptions.cellHeight) + "px";
  }

  @computedFrom("placeholder.y", "sizeOptions.cellHeight")
  get top() {
    return (this.placeholder.y * this.sizeOptions.cellHeight) + "px";
  }
  
  @computedFrom("placeholder.x", "sizeOptions.columns")
  get left() {
    return (1 / this.sizeOptions.columns * this.placeholder.x * 100) + "%";
  }
}