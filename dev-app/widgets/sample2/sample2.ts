import { autoinject } from "aurelia-framework";

@autoinject
export class Sample2 {
  constructor() {}

  model: any;

  activate(model: any) {
    this.model = model;
  }
}