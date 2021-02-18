import {
    Component
  } from '@loopback/core';
  import {LogsProvider} from '../provider/log.provider';
  
  export class WinstonLogComponent implements Component {
    providers = {}
    constructor() {
      this.providers = {
        'winston-log-component.log-fn': LogsProvider
      }
    }
  }
  