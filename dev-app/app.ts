import { autoinject, PLATFORM } from "aurelia-framework";
import { IAuGridCell, AuGrid } from "resources";

@autoinject
export class App {
  constructor() {}

  cells: IAuGridCell[] = [{
    x: 0,
    y: 0,
    width: 6,
    height: 3,
    cellClass: "cell1",
    viewModel: PLATFORM.moduleName("content")
  }, {
    x: 6,
    y: 0,
    width: 4,
    height: 4,
    minHeight: 4,
    maxHeight: 6,
    minWidth: 4,
    maxWidth: 6,
    cellClass: "cell2",
    viewModel: PLATFORM.moduleName("content")
  },
  {
    x: 6,
    y: 5,
    width: 2,
    height: 2,
    cellClass: "cell1",
    viewModel: PLATFORM.moduleName("content")
  }];

  columns = 12;
  cellHeight = 25;

  grid: AuGrid;

  onAddClick() {
    const cell: IAuGridCell = {
      width: 3,
      height: 3,
      x: 0,
      y: 100,
      viewModel: PLATFORM.moduleName("content")
    };

    this.grid.addCell(cell);
  }
  onDeleteClick() {
    this.grid.deleteCell(this.grid.getCells()[0]);
  }
  onSaveClick() {
    localStorage["cells"] = JSON.stringify(this.grid.getCells());
  }
  onLoadClick() {
    const content = localStorage["cells"];
    if (!content) {
      return;
    }

    this.grid.cells = JSON.parse(content);
  }
}
