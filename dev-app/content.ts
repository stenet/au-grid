import { autoinject } from "aurelia-framework";

@autoinject
export class Content {
  constructor(
    private _element: Element
  ) {}

  DeleteMe() {
    this._element.dispatchEvent(new CustomEvent(
      "au-grid-cell-delete", {
        bubbles: true
      }
    ));
  }
  UpdateHeight() {
    this._element.dispatchEvent(new CustomEvent(
      "au-grid-cell-update-height", {
        bubbles: true,
        detail: {
          height: 400
        }
      }
    ));
  }
}