import { IAuGridCellBase } from "./au-grid-cell-base";

export interface IAuGridCellManipulate extends IAuGridCellBase {
  t?: string;
  l?: string;
  w?: string;
  h?: string;
}