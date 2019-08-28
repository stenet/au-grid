import { IAuGridCellManipulateOptions } from "./au-grid-cell-manipulate-options";
import { IAuGridCellBase } from "./au-grid-cell-base";

export interface IAuGridCell extends IAuGridCellBase {
  cellClass?: string;
  manipulateOptions?: IAuGridCellManipulateOptions;

  content: string;
}