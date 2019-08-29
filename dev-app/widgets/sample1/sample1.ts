import { autoinject } from "aurelia-framework";

@autoinject
export class Sample1 {
  constructor() {}

  model: any;

  activate(model: any) {
    this.model = model;
  }
}