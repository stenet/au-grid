import { IAuGridCellManipulateOptions } from "./au-grid-cell-manipulate-options";
import { IAuGridCellBase } from "./au-grid-cell-base";
import { IAuGridCellManipulate } from "./au-grid-cell-manipulate";

export interface IAuGridCell extends IAuGridCellBase {
  cellClass?: string;
  manipulateOptions?: IAuGridCellManipulateOptions;
  manipulate?: IAuGridCellManipulate;

  content: string;
}