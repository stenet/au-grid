import { AuGridCell } from "au-grid-cell/au-grid-cell";

export interface IAuGridManipulateInfo {
  element: HTMLElement;
  cell: AuGridCell;
  resizing: boolean;
  dragging: boolean;

  origX: number;
  origY: number;
  origWidth: number;
  origHeight: number;

  origTop: number;
  origLeft: number;

  origMouseTop: number;
  origMouseLeft: number;
  currMouseTop: number;
  currMouseLeft: number;
}