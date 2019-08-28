import { autoinject } from "aurelia-framework";
import { IAuGridCellBase } from "../interfaces/au-grid-cell-base";

@autoinject
export class SizeService {
  constructor() {}

  isOverlapping(cell1: IAuGridCellBase, cell2: IAuGridCellBase) {
    const c1 = {
      l: cell1.x + 0.0,
      t: cell1.y + 0.0,
      r: (cell1.x + cell1.width - 0.0),
      b: (cell1.y + cell1.height - 0.0)
    };

    const c2 = {
      l: cell2.x + 0.0,
      t: cell2.y + 0.0,
      r: (cell2.x + cell2.width - 0.0),
      b: (cell2.y + cell2.height - 0.0)
    };
    
    return !(c2.l > c1.r || c2.r < c1.l || c2.t > c1.b || c2.b < c1.t);
  }
}