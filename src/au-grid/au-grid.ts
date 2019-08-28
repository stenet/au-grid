import { autoinject, bindable, computedFrom, elementConfig } from "aurelia-framework";
import { IAuGridCell } from "../interfaces/au-grid-cell";
import { IAuGridSizeOptions } from "../interfaces/au-grid-size-options";
import { IAuGridManipulateOptions } from "../interfaces/au-grid-manipulate-options";
import { IAuGridManipulateInfo } from "../interfaces/au-grid-manipulate-info";
import { AuGridCell } from "../au-grid-cell/au-grid-cell";
import { IAuGridCellPlaceholder } from "../interfaces/au-grid-cell-placeholder";
import { IAuGridCellBase } from "../interfaces/au-grid-cell-base";
import { SizeService } from "../services/size-service";

@autoinject
export class AuGrid {
  private _onMouseDown: any;
  private _onMouseUp: any;
  private _onMouseMove: any;

  constructor(
    private _element: Element,
    private _sizeService: SizeService
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
  placeholder: IAuGridCellPlaceholder = null;

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
    if (!this.cells) {
      return 0;
    }

    const heights = this.cells
      .filter(c => !this.manipulateInfo || this.manipulateInfo.cell.cell != c)
      .map(c => c.y * this.sizeOptions.cellHeight + c.height * this.sizeOptions.cellHeight);

    if (this.placeholder) {
      heights.push(this.placeholder.y * this.sizeOptions.cellHeight + this.placeholder.height * this.sizeOptions.cellHeight);
    }

    const height = Math.max(...heights);

    this.height = height
      ? height + "px"
      : "20px";
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
    this.activatePlaceholder();

    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mouseup", this._onMouseUp);
  }
  private onMouseUp(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    this.clearMouseEvents();
    
    this.removeManipulateInfo();
    this.deactivatePlaceholder();
    this.updateHeight();
  }
  private onMouseMove(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    if (!this.manipulateInfo) {
      return;
    }

    this.manipulateInfo.currMouseLeft = ev.x;
    this.manipulateInfo.currMouseTop = ev.y;
    this.movePlaceholder();
    this.resolveOverlaps();
    this.updateHeight();
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
  private removeManipulateInfo() {
    this.manipulateInfo = null;
  }

  private activatePlaceholder() {
    this.placeholder = {
      x: this.manipulateInfo.origX,
      y: this.manipulateInfo.origY,
      width: this.manipulateInfo.origWidth,
      height: this.manipulateInfo.origHeight
    };
  }
  private movePlaceholder() {
    const cellWidth = Math.floor(this._element.clientWidth / this.sizeOptions.columns);

    const xDiff = this.manipulateInfo.currMouseLeft - this.manipulateInfo.origMouseLeft;
    const xTotal = Math.floor(Math.abs(xDiff) / cellWidth);
    const xMod = Math.abs(xDiff) % cellWidth;

    let xAdd = 0;
    if (xDiff > 0) {
      xAdd = xTotal
        + (xMod ? (xMod / cellWidth > .5 ? 1 : 0) : 0);
    } else if (xDiff < 0) {
      xAdd = -xTotal
        + (xMod ? (xMod / cellWidth > .5 ? -1 : 0) : 0);
    }

    const cellHeight = this.sizeOptions.cellHeight;
    const yDiff = this.manipulateInfo.currMouseTop - this.manipulateInfo.origMouseTop;
    const yTotal = Math.floor(Math.abs(yDiff) / cellHeight);
    const yMod = Math.abs(yDiff) % cellHeight;

    let yAdd = 0;
    if (yDiff > 0) {
      yAdd = yTotal
        + (yMod ? (yMod / cellHeight > .5 ? 1 : 0) : 0);
    } else if (yDiff < 0) {
      yAdd = -yTotal
        + (yMod ? (yMod / cellHeight > .5 ? -1 : 0) : 0);
    }

    let xNew = this.manipulateInfo.origX + xAdd;
    if (xNew + this.manipulateInfo.origWidth > this.sizeOptions.columns) {
      xNew = this.sizeOptions.columns - this.manipulateInfo.origWidth;
    } else if (xNew < 0) {
      xNew = 0;
    }

    let yNew = this.manipulateInfo.origY + yAdd;
    if (yNew < 0) {
      yNew = 0;
    }

    while (yNew > 0) {
      const overlappingCell = this.getOverlappingCell({
        x: xNew,
        y: yNew,
        width: this.manipulateInfo.origWidth,
        height: this.manipulateInfo.origHeight
      });

      if (overlappingCell) {
        break;
      }

      yNew--;
    }

    this.placeholder.x = xNew;
    this.placeholder.y = yNew;
  }
  private deactivatePlaceholder() {
    this.placeholder = null;
  }
  
  private getOverlappingCell(cell: IAuGridCellBase) {
    return this.cells
      .filter(c => !this.manipulateInfo || this.manipulateInfo.cell.cell != c)
      .find(c => this._sizeService.isOverlapping(cell, c));
  }
  private resolveOverlaps() {

  }
}