import { autoinject, bindable, computedFrom, elementConfig } from "aurelia-framework";
import { IAuGridCell } from "../interfaces/au-grid-cell";
import { IAuGridSizeOptions } from "../interfaces/au-grid-size-options";
import { IAuGridManipulateOptions } from "../interfaces/au-grid-manipulate-options";
import { IAuGridManipulateInfo } from "../interfaces/au-grid-manipulate-info";
import { AuGridCell } from "au-grid-cell/au-grid-cell";

@autoinject
export class AuGrid {
  private _onMouseDown: any;
  private _onMouseUp: any;
  private _onMouseMove: any;

  constructor(
    private _element: Element
  ) {}

  @bindable cells: IAuGridCell[];
  @bindable sizeOptions: IAuGridSizeOptions = {
    cellHeight: 50,
    columns: 12
  }
  @bindable manipulateOptions: IAuGridManipulateOptions = {
    canMove: true,
    canResize: true
  }

  height: string;
  manipulateInfo: IAuGridManipulateInfo = null;

  bind() {
    this.updateHeight();

    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);

    if (this.manipulateOptions.canMove) {
      this._element.addEventListener("mousedown", this._onMouseDown);
    }
  }
  unbind() {

  }

  updateHeight() {
    const height = this.calcHeight();

    this.height = height
      ? height + "px"
      : "20px";
  }  

  private calcHeight() {
    if (!this.cells) {
      return 0;
    }

    const heights = this.cells.map(c => c.y * this.sizeOptions.cellHeight + c.height * this.sizeOptions.cellHeight);
    return Math.max(...heights);
  }
  
  private onMouseDown(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    const el = <HTMLElement>ev.target;
    const cellEl = <HTMLElement>el.closest("au-grid-cell");

    if (!cellEl) {
      return;
    }

    const cell: AuGridCell = cellEl["au"].controller.viewModel;

    this.manipulateInfo = this.createManipulateInfo(ev, cellEl, cell, false, true);

    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mouseup", this._onMouseUp);
  }
  private onMouseUp(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    this.clearMouseEvents();
    this.manipulateInfo = null;
  }
  private onMouseMove(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    if (!this.manipulateInfo) {
      return;
    }

    this.manipulateInfo.currMouseLeft = ev.x;
    this.manipulateInfo.currMouseTop = ev.y;
  }
  private clearMouseEvents() {
    window.removeEventListener("mousemove", this._onMouseMove);
    window.removeEventListener("mouseup", this._onMouseUp);
  }

  private createManipulateInfo(ev: MouseEvent, element: HTMLElement, cell: AuGridCell, resizing: boolean, dragging: boolean) {
    return <IAuGridManipulateInfo>{
      element,
      cell,
      origX: cell.cell.x,
      origY: cell.cell.y,
      origWidth: cell.cell.width,
      origHeight: cell.cell.height,
      origTop: element.offsetTop,
      origLeft: element.offsetLeft,
      origMouseLeft: ev.x,
      origMouseTop: ev.y,
      currMouseLeft: ev.x,
      currMouseTop: ev.y,
      dragging,
      resizing
    };
  }
}