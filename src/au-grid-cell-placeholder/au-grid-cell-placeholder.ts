import { autoinject, bindable } from "aurelia-framework";
import { IAuGridCellPlaceholder } from "../interfaces/au-grid-cell-placeholder";

@autoinject
export class AuGridCellPlaceholder {
  constructor() {}

  @bindable placeholder: IAuGridCellPlaceholder;
}