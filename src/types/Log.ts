import { Request } from "@loopback/rest";

export type LogFn = (request?: Request) => void;
