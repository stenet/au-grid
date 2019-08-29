import { autoinject } from "aurelia-framework";

@autoinject
export class Sample1Setting {
  constructor() {}

  model: any;

  activate(model: any) {
    this.model = model;
  }
}