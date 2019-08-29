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

    this.cells = JSON.parse(`[{"width":3,"height":3,"x":0,"y":0,"viewModel":"widgets/sample2/sample2","model":{"widget":{"titel":"Sample 2","viewModel":"widgets/sample2/sample2","settings":{"text":"Sample 2"}},"settings":{"text":"Sample 2"},"data":null},"manipulate":{"x":0,"y":0,"width":3,"height":3,"w":"25%","h":"75px","l":"0%","t":"0px"}},{"width":3,"height":3,"x":5,"y":0,"viewModel":"widgets/sample2/sample2","model":{"widget":{"titel":"Sample 2","viewModel":"widgets/sample2/sample2","settings":{"text":"Sample 2"}},"settings":{"text":"Sample 2"},"data":null},"manipulate":{"x":5,"y":0,"width":3,"height":3,"w":"25%","h":"75px","l":"41.666666666666664%","t":"0px"}},{"width":3,"height":3,"x":0,"y":3,"viewModel":"widgets/sample2/sample2","model":{"widget":{"titel":"Sample 2","viewModel":"widgets/sample2/sample2","settings":{"text":"Sample 2"}},"settings":{"text":"Sample 2"},"data":null},"manipulate":{"x":0,"y":3,"width":3,"height":3,"w":"25%","h":"75px","l":"0%","t":"75px"}},{"width":3,"height":3,"x":7,"y":3,"viewModel":"widgets/sample2/sample2","model":{"widget":{"titel":"Sample 2","viewModel":"widgets/sample2/sample2","settings":{"text":"Sample 2"}},"settings":{"text":"Sample 2"},"data":null},"manipulate":{"x":7,"y":3,"width":3,"height":3,"w":"25%","h":"75px","l":"58.33333333333333%","t":"75px"}},{"width":3,"height":3,"x":0,"y":6,"viewModel":"widgets/sample2/sample2","model":{"widget":{"titel":"Sample 2","viewModel":"widgets/sample2/sample2","settings":{"text":"Sample 2"}},"settings":{"text":"Sample 2"},"data":null},"manipulate":{"x":0,"y":6,"width":3,"height":3,"w":"25%","h":"75px","l":"0%","t":"150px"}},{"width":3,"height":3,"x":4,"y":3,"viewModel":"widgets/sample2/sample2","model":{"widget":{"titel":"Sample 2","viewModel":"widgets/sample2/sample2","settings":{"text":"Sample 2"}},"settings":{"text":"Sample 2"},"data":null},"manipulate":{"x":4,"y":3,"width":3,"height":3,"w":"25%","h":"75px","l":"33.33333333333333%","t":"75px"}},{"width":3,"height":3,"x":0,"y":9,"viewModel":"widgets/sample1/sample1","model":{"widget":{"titel":"Sample 1","viewModel":"widgets/sample1/sample1","settingViewModel":"widgets/sample1-setting/sample1-setting","settings":{"text":"Sample 1"}},"settings":{"text":"This is a test"},"data":null},"manipulate":{"x":0,"y":9,"width":3,"height":3,"w":"25%","h":"75px","l":"0%","t":"225px"}},{"width":3,"height":3,"x":0,"y":12,"viewModel":"widgets/sample2/sample2","model":{"widget":{"titel":"Sample 2","viewModel":"widgets/sample2/sample2","settings":{"text":"Sample 2"}},"settings":{"text":"Sample 2"},"data":null},"manipulate":{"x":0,"y":12,"width":3,"height":3,"w":"25%","h":"75px","l":"0%","t":"300px"}},{"width":3,"height":3,"x":7,"y":6,"viewModel":"widgets/sample1/sample1","model":{"widget":{"titel":"Sample 1","viewModel":"widgets/sample1/sample1","settingViewModel":"widgets/sample1-setting/sample1-setting","settings":{"text":"Sample 1"}},"settings":{"text":"Sample 1"},"data":null},"manipulate":{"x":7,"y":6,"width":3,"height":3,"w":"25%","h":"75px","l":"58.33333333333333%","t":"150px"}},{"width":3,"height":3,"x":7,"y":12,"viewModel":"widgets/sample1/sample1","model":{"widget":{"titel":"Sample 1","viewModel":"widgets/sample1/sample1","settingViewModel":"widgets/sample1-setting/sample1-setting","settings":{"text":"Sample 1"}},"settings":{"text":"Works quite well"},"data":null},"manipulate":{"x":7,"y":12,"width":3,"height":3,"w":"25%","h":"75px","l":"58.33333333333333%","t":"300px"}},{"width":3,"height":3,"x":5,"y":9,"viewModel":"widgets/sample2/sample2","model":{"widget":{"titel":"Sample 2","viewModel":"widgets/sample2/sample2","settings":{"text":"Sample 2"}},"settings":{"text":"Sample 2"},"data":null},"manipulate":{"x":5,"y":9,"width":3,"height":3,"w":"25%","h":"75px","l":"41.666666666666664%","t":"225px"}}]`);
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
