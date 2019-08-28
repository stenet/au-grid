import { autoinject } from "aurelia-framework";
import { IAuGridCellBase } from "../interfaces/au-grid-cell-base";

@autoinject
export class SizeService {
  constructor() {}

  isOverlapping(cell1: IAuGridCellBase, cell2: IAuGridCellBase) {
    return !(cell2.x >= cell1.x + cell1.width
      || cell2.x + cell2.width <= cell1.x 
      || cell2.y >= cell1.y + cell1.height
      || cell2.y + cell2.height <= cell1.y);
  }
}