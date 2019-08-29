import { AuGridCell } from "../au-grid-cell/au-grid-cell";

export interface IAuGridManipulateInfo {
  element: HTMLElement;
  cell: AuGridCell;
  resizing: boolean;
  moving: boolean;

  hasMoved: boolean;

  origX: number;
  origY: number;
  origWidth: number;
  origHeight: number;

  origTop: number;
  origLeft: number;
  origClientWidth: number;
  origClientHeight: number;

  origMouseTop: number;
  origMouseLeft: number;
  currMouseTop: number;
  currMouseLeft: number;
}