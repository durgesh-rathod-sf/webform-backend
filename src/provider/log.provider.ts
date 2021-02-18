import {
  MethodDecoratorFactory,
  Provider,
  ValueOrPromise,
} from "@loopback/core";
import { Request } from "@loopback/rest";
import * as winston from "winston";
import { LogFn } from "../types/Log";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: "user-api",
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
export class LogsProvider implements Provider<LogFn> {
  constructor() {}
  value(): LogFn {
    return <LogFn>((request: Request) => this.log(request));
  }
  @logFnDecorator({ description: "Winston log function" })
  private log(request: Request): void {
    logger.info(`Request from ${request.headers.host}`);
  }
}

export interface LogFnMetadata {
  description: string;
}

function logFnDecorator(spec: LogFnMetadata): MethodDecorator {
  return MethodDecoratorFactory.createDecorator<LogFnMetadata>(
    "metadata-key-for-my-method-decorator",
    spec
  );
}
