import { IAuGridCellBase } from "./au-grid-cell-base";
import { IAuGridCellManipulate } from "./au-grid-cell-manipulate";

export interface IAuGridCell extends IAuGridCellBase {
  cellClass?: string;
  manipulate?: IAuGridCellManipulate;

  minHeight?: number;
  minWidth?: number;
  maxHeight?: number;
  maxWidth?: number;

  viewModel?: string;
  model?: any;
  data?: any;
}