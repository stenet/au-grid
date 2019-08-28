import {FrameworkConfiguration} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';

export * from "./interfaces/au-grid-cell";
export * from "./au-grid/au-grid";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('./au-grid/au-grid')
  ]);
}
