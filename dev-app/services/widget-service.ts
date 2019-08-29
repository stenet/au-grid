import { autoinject } from "aurelia-framework";

@autoinject
export class WidgetService {
  constructor() {}

  widgets: IWidget[] = [];
}

export interface IWidget {
  titel: string;
  viewModel: string;
  settingViewModel?: string;
  settings?: any;
}