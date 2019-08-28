import { IAuGridCellManipulateOptions } from "./au-grid-cell-manipulate-options";

export interface IAuGridCell {
  x: number;
  y: number;
  width: number;
  height: number;

  cellClass?: string;
  manipulateOptions?: IAuGridCellManipulateOptions;

  content: string;
}