import { autoinject, bindable } from "aurelia-framework";
import { IWidget } from "../../services/widget-service";

@autoinject
export class Toolbar {
  constructor(
    private _element: Element
  ) {}

  @bindable model: any;

  onSettingClick() {
    this._element.dispatchEvent(new CustomEvent(
      "widget-setting", {
        bubbles: true,
        detail: {
          model: this.model
        }
      }
    ));
  }
  onDeleteClick() {
    this._element.dispatchEvent(new CustomEvent(
      "au-grid-cell-delete", {
        bubbles: true
      }
    ));
  }
}