import { autoinject, bindable, computedFrom, elementConfig, observable, bindingBehavior } from "aurelia-framework";
import { IAuGridCell } from "../interfaces/au-grid-cell";
import { IAuGridManipulateInfo } from "../interfaces/au-grid-manipulate-info";
import { AuGridCell } from "../au-grid-cell/au-grid-cell";
import { IAuGridCellPlaceholder } from "../interfaces/au-grid-cell-placeholder";
import { IAuGridCellBase } from "../interfaces/au-grid-cell-base";
import { SizeService } from "../services/size-service";
import { IAuGridCellManipulate } from "interfaces/au-grid-cell-manipulate";

@autoinject
export class AuGrid {
  private _onMouseDown: any;
  private _onMouseDownRegistered = false;
  private _onMouseUp: any;
  private _onMouseMove: any;
  private _onResize: any;

  constructor(
    private _element: Element,
    private _sizeService: SizeService
  ) {}

  @bindable @observable cells: IAuGridCell[] = [];
  @bindable @observable columns = 12;
  @bindable @observable cellHeight = 25;
  @bindable padding = 5;
  @bindable autoColumns = true;
  @bindable @observable canResize = false;
  @bindable @observable canMove = false;

  height: string;
  manipulateInfo: IAuGridManipulateInfo = null;
  placeholder: IAuGridCellPlaceholder = null;

  bind() {
    this.checkAutoColumns();
    this.createCellManipulatorsIfMissing();
    this.validateCellManipulators();
    this.calcCellsPosAndSize();
    this.updateHeight();

    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);

    this.checkAutoColumns();
    this.checkMouseDownHandlers();
  }
  unbind() {
    if (this._onResize) {
      window.removeEventListener("resize", this._onResize);
    }
  }

  cellsChanged() {
    this.createCellManipulatorsIfMissing();
  }
  columnsChanged() {
    this.validateCellManipulators();
    this.resolveOverlaps();
    this.compressCells();
    this.calcCellsPosAndSize();
    this.updateHeight();
  }
  cellHeightChanged() {
    this.resolveOverlaps();
    this.compressCells();
    this.calcCellsPosAndSize();
    this.updateHeight();
  }
  canResizeChanged() {
    this.checkMouseDownHandlers();
  }
  canMoveChanged() {
    this.checkMouseDownHandlers();
  }

  updateHeight() {
    if (!this.cells) {
      return 0;
    }

    const heights = this.cells
      .filter(c => !this.manipulateInfo || this.manipulateInfo.cell.cell != c)
      .map(c => c.manipulate.y * this.cellHeight + c.manipulate.height * this.cellHeight);

    if (this.placeholder) {
      heights.push(this.placeholder.y * this.cellHeight + this.placeholder.height * this.cellHeight);
    }

    const height = Math.max(...heights);

    this.height = height
      ? height + "px"
      : "20px";
  } 

  private createCellManipulatorsIfMissing() {
    if (!this.cells) {
      return;
    }

    this.cells
      .filter(c => !c.manipulate)
      .forEach(c => c.manipulate = this.createCellManipulator(c));
  }
  private createCellManipulator(cell: IAuGridCellBase) {
    return <IAuGridCellManipulate>{
        x: cell.x,
        y: cell.y,
        width: cell.width,
        height: cell.height
      };
  }
  private checkMouseDownHandlers() {
    if (!this._onMouseDownRegistered && (this.canMove || this.canResize)) {
      this._element.addEventListener("mousedown", this._onMouseDown);
    } else if (this._onMouseDownRegistered && !this.canMove && !this.canResize) {
      this._element.removeEventListener("mousedown", this._onMouseDown);
    }
  }
  private checkAutoColumns() {
    if (!this.autoColumns) {
      return;
    }

    this._onResize = (() => {
      const width = this._element.clientWidth;
      if (width > 1200) {
        this.columns = 12;
      } else if (width > 992) {
        this.columns = 8;
      } else if (width > 768) {
        this.columns = 4;
      } else {
        this.columns = 1;
      }
    }).bind(this);

    window.addEventListener("resize", this._onResize);
  }
  private validateCellManipulators() {
    for (let cell of this.cells) {
      const manipulate = cell.manipulate;

      manipulate.width = cell.width;
      manipulate.x = cell.x;

      if (manipulate.width > this.columns) {
        manipulate.width = this.columns;
        manipulate.x = 0;
      }
      if (manipulate.width + manipulate.x > this.columns) {
        manipulate.x = this.columns - manipulate.width;
      }
    }
  }
  private calcCellsPosAndSize() {
    if (this.placeholder) {
      this.calcCellPosAndSize(this.placeholder);
    }
    
    this
      .cells
      .forEach(c => {
        if (!c.manipulate) {
          c.manipulate = this.createCellManipulator(c);
        }

        this.calcCellPosAndSize(c.manipulate);
      });

  }
  private calcCellPosAndSize(manipulate: IAuGridCellManipulate) {
    if (this.manipulateInfo && this.manipulateInfo.cell.cell.manipulate == manipulate) {
      if (this.manipulateInfo.resizing) {
        manipulate.w = (manipulate.width / this.columns * 100) + "%";
        manipulate.h = (manipulate.height * this.cellHeight) + "px";
        manipulate.l = (1 / this.columns * manipulate.x * 100) + "%";
        manipulate.t = (manipulate.y * this.cellHeight) + "px";
      } else if (this.manipulateInfo.moving) {
        manipulate.w = (manipulate.width / this.columns * 100) + "%";
        manipulate.h = (manipulate.height * this.cellHeight) + "px";
        manipulate.l = (this.manipulateInfo.origLeft - this.manipulateInfo.origMouseLeft + this.manipulateInfo.currMouseLeft) + "px";
        manipulate.t = (this.manipulateInfo.origTop - this.manipulateInfo.origMouseTop + this.manipulateInfo.currMouseTop) + "px";
      } else {
        throw new Error("invalid manipulateInfo");
      }
    } else {
      manipulate.w = (manipulate.width / this.columns * 100) + "%";
      manipulate.h = (manipulate.height * this.cellHeight) + "px";
      manipulate.l = (1 / this.columns * manipulate.x * 100) + "%";
      manipulate.t = (manipulate.y * this.cellHeight) + "px";
    }
  }
  private updatePosAndSizeFromManipulator() {
    this.cells
      .forEach(c => {
        c.x = c.manipulate.x;
        c.y = c.manipulate.y;
        c.width = c.manipulate.width;
        c.height = c.manipulate.height;
      })
  }
  
  private onMouseDown(ev: MouseEvent) {
    if (!this.canMove && !this.canResize) {
      return;
    }

    const el = <HTMLElement>ev.target;
    const cellEl = <HTMLElement>el.closest("au-grid-cell");

    if (!cellEl) {
      return;
    }

    const cell: AuGridCell = cellEl["au"].controller.viewModel;

    const resizeEl = <HTMLElement>el.closest(".au-grid-cell__resize");
    const isResize = !!resizeEl;
    const isDragging = !isResize;

    if (isResize && !this.canResize) {
      return;
    } else if (isDragging && !this.canMove) {
      return;
    }

    ev.preventDefault();
    ev.stopPropagation();

    this.manipulateInfo = this.createManipulateInfo(ev, cellEl, cell, isResize, isDragging);
    this.activatePlaceholder();

    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mouseup", this._onMouseUp);
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
    this.compressCells();
    this.calcCellsPosAndSize();
    this.updateHeight();
  }
  private onMouseUp(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    this.clearMouseEvents();
    
    this.removeManipulateInfo();
    this.deactivatePlaceholder();
    this.updatePosAndSizeFromManipulator();
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
      origX: cell.cell.manipulate.x,
      origY: cell.cell.manipulate.y,
      origWidth: cell.cell.manipulate.width,
      origHeight: cell.cell.manipulate.height,
      origTop: element.offsetTop,
      origLeft: element.offsetLeft,
      origMouseLeft: ev.x,
      origMouseTop: ev.y,
      currMouseLeft: ev.x,
      currMouseTop: ev.y,
      moving: dragging,
      resizing
    };
  }
  private removeManipulateInfo() {
    if (!this.manipulateInfo) {
      return;
    }

    const manipulate = this.manipulateInfo.cell.cell.manipulate;
    this.manipulateInfo = null;

    manipulate.x = this.placeholder.x;
    manipulate.y = this.placeholder.y;
    manipulate.width = this.placeholder.width;
    manipulate.height = this.placeholder.height;

    this.calcCellPosAndSize(manipulate);
  }

  private activatePlaceholder() {
    const placeholder: IAuGridCellPlaceholder = {
      x: this.manipulateInfo.origX,
      y: this.manipulateInfo.origY,
      width: this.manipulateInfo.origWidth,
      height: this.manipulateInfo.origHeight
    };

    this.placeholder = placeholder;
  }
  private movePlaceholder() {
    const cellWidth = Math.floor(this._element.clientWidth / this.columns);

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

    const cellHeight = this.cellHeight;
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

    if (this.manipulateInfo.moving) {
      let xNew = this.manipulateInfo.origX + xAdd;
      if (xNew + this.manipulateInfo.origWidth > this.columns) {
        xNew = this.columns - this.manipulateInfo.origWidth;
      } else if (xNew < 0) {
        xNew = 0;
      }
  
      let yNew = this.manipulateInfo.origY + yAdd;
      if (yNew < 0) {
        yNew = 0;
      }
  
      this.placeholder.x = xNew;
      this.placeholder.y = yNew;
    } else if (this.manipulateInfo.resizing) {
      let widthNew = this.manipulateInfo.origWidth + xAdd;
      let xNew = this.manipulateInfo.origX;

      if (this.manipulateInfo.cell.cell.minWidth && widthNew < this.manipulateInfo.cell.cell.minWidth) {
        widthNew = this.manipulateInfo.cell.cell.minWidth;
      }
      if (this.manipulateInfo.cell.cell.maxWidth && widthNew > this.manipulateInfo.cell.cell.maxWidth) {
        widthNew = this.manipulateInfo.cell.cell.maxWidth;
      }

      if (widthNew > this.columns) {
        widthNew = this.columns;
      } else if (widthNew + this.manipulateInfo.origX > this.columns)  {
        xNew = this.columns - widthNew;
      }

      if (widthNew < 1) {
        widthNew = 1;
      }
        
      let heightNew = this.manipulateInfo.origHeight + yAdd;

      if (this.manipulateInfo.cell.cell.minHeight && heightNew < this.manipulateInfo.cell.cell.minHeight) {
        heightNew = this.manipulateInfo.cell.cell.minHeight;
      }
      if (this.manipulateInfo.cell.cell.maxHeight && heightNew > this.manipulateInfo.cell.cell.maxHeight) {
        heightNew = this.manipulateInfo.cell.cell.maxHeight;
      }

      if (heightNew < 1) {
        heightNew = 1;
      }
        
      this.placeholder.x = xNew;
      this.placeholder.width = widthNew;
      this.placeholder.height = heightNew;
    }
  }
  private deactivatePlaceholder() {
    this.placeholder = null;
  }
  
  private getOverlappingCells(cell: IAuGridCellBase, checkCells?: IAuGridCellBase[]) {
    return (checkCells || this.cells)
      .filter(c => !this.manipulateInfo || this.manipulateInfo.cell.cell != c)
      .filter(c => c != cell)
      .filter(c => this._sizeService.isOverlapping(cell, c));
  }
  private resolveOverlaps() {
    const manipulators = this.cells
      .map(c => c.manipulate)
      .filter(c => !this.manipulateInfo || this.manipulateInfo.cell.cell.manipulate != c)
      .sort((a, b) => {
        if (a.y != b.y) {
          return a.y - b.y;
        }

        return a.x - b.x;
      });

    if (this.placeholder) {
      manipulators.splice(0, 0, this.placeholder);
    }

    for (let i = 0; i < manipulators.length; i++) {
      const cell = manipulators[i];

      while (true) {
        const overlappingCells = this.getOverlappingCells(cell, manipulators.slice(i + 1));
        if (overlappingCells.length == 0) {
          break;
        }

        overlappingCells
          .forEach(c => c.y = c.y + 1);
      }
    }
  }
  private compressCells() {
    const manipulators = this.cells
      .map(c => c.manipulate)
      .filter(c => !this.manipulateInfo || this.manipulateInfo.cell.cell.manipulate != c);
      
    if (this.placeholder) {
      manipulators.push(this.placeholder);
    }

    manipulators
      .sort((a, b) => {
        if (a.y != b.y) {
          return a.y - b.y;
        }

        return a.x - b.x;
      });

    for (let manipulator of manipulators) {
      while (manipulator.y > 0) {
        const overlappingCells = this.getOverlappingCells({
          x: manipulator.x,
          y: manipulator.y - 1,
          width: manipulator.width,
          height: manipulator.height
        }, manipulators.filter(c => c != manipulator));
  
        if (overlappingCells.length > 0) {
          break;
        }
  
        manipulator.y--;
      }
    }
  }
}