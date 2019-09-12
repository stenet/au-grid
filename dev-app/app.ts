import { autoinject, PLATFORM } from "aurelia-framework";
import { IAuGridCell, AuGrid } from "resources";
import { WidgetService } from "./services/widget-service";

@autoinject
export class App {
  constructor(
    private _widgetService: WidgetService
  ) {
    this._widgetService.widgets.push({
      titel: "Sample 1",
      viewModel: PLATFORM.moduleName("widgets/sample1/sample1"),
      settingViewModel: PLATFORM.moduleName("widgets/sample1-setting/sample1-setting"),
      settings: {
        text: "Sample 1"
      }
    });

    this._widgetService.widgets.push({
      titel: "Sample 2",
      viewModel: PLATFORM.moduleName("widgets/sample2/sample2"),
      settings: {
        text: "Sample 2"
      }
    });

    const cells = JSON.parse(`[
      {
        "x": 3,
        "y": 8,
        "width": 4,
        "height": 16,
        "viewModel": "widgets/sample1/sample1",
        "model": {
          "settings": {
            "text": "1"
          },
          "data": null
        }
      },
      {
        "x": 6,
        "y": 24,
        "width": 6,
        "height": 21,
        "viewModel": "widgets/sample1/sample1",
        "model": {
          "settings": {
            "text": "2"
          },
          "data": null
        }
      },
      {
        "x": 0,
        "y": 24,
        "width": 6,
        "height": 21,
        "viewModel": "widgets/sample1/sample1",
        "model": {
          "settings": {
            "text": "3"
          },
          "data": null
        }
      },
      {
        "x": 7,
        "y": 8,
        "width": 5,
        "height": 16,
        "viewModel": "widgets/sample1/sample1",
        "model": {
          "settings": {
            "text": "4"
          },
          "data": null
        }
      },
      {
        "x": 0,
        "y": 0,
        "width": 12,
        "height": 8,
        "viewModel": "widgets/sample1/sample1",
        "model": {
          "settings": {
            "text": "5"
          },
          "data": null
        }
      },
      {
        "x": 0,
        "y": 8,
        "width": 3,
        "height": 16,
        "viewModel": "widgets/sample1/sample1",
        "model": {
          "settings": {
            "text": "6"
          },
          "data": null
        }
      }
    ]`);

    setTimeout(() => {
      this.cells = cells;
    }, 300);
  }

  cells: IAuGridCell[] = [];

  columns = 12;
  cellHeight = 25;

  grid: AuGrid;

  settingViewModel: string;
  settingModel: any;

  onAddClick() {
    const index = Math.floor(Math.random() * this._widgetService.widgets.length);
    const widget = this._widgetService.widgets[index];

    const cell: IAuGridCell = {
      width: 3,
      height: 3,
      x: 0,
      y: 100,
      viewModel: widget.viewModel,
      model: {
        widget: widget,
        settings: JSON.parse(JSON.stringify(widget.settings || {})),
        data: null
      }
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

  onWidgetSetting(ev: CustomEvent) {
    this.settingViewModel = ev.detail.model.widget.settingViewModel;
    this.settingModel = ev.detail.model;
  }
}
