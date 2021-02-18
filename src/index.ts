import { extensionFor } from "@loopback/core";
import {
  format,
  LoggingBindings,
  WinstonFormat,
  WinstonTransports,
  WINSTON_FORMAT,
  WINSTON_TRANSPORT,
} from "@loopback/logging";
import { ApplicationConfig, WebformBackendApplication } from "./application";

export * from "./application";

export async function main(options: ApplicationConfig = {}) {
  const app = new WebformBackendApplication(options);
  await app.boot();
  await app.start();
  app.configure(LoggingBindings.COMPONENT).to({
    enableFluent: false, // default to true
    enableHttpAccessLog: true, // default to true
  });

  app.configure(LoggingBindings.FLUENT_SENDER).to({
    host: process.env.FLUENTD_SERVICE_HOST ?? "localhost",
    port: +(process.env.FLUENTD_SERVICE_PORT_TCP ?? 24224),
    timeout: 3.0,
    reconnectInterval: 600000, // 10 minutes
  });
  app.configure(LoggingBindings.WINSTON_LOGGER).to({
    level: "info",
    format: format.json(),
    defaultMeta: { framework: "LoopBack" },
  });

  const myFormat: WinstonFormat = format((info, opts) => {
    console.log(info);
    return false;
  })();

  app
    .bind("logging.winston.formats.myFormat")
    .to(myFormat)
    .apply(extensionFor(WINSTON_FORMAT));
  app
    .bind("logging.winston.formats.colorize")
    .to(format.colorize())
    .apply(extensionFor(WINSTON_FORMAT));

  const consoleTransport = new WinstonTransports.Console({
    level: "info",
    format: format.combine(format.colorize(), format.simple()),
  });
  app
    .bind("logging.winston.transports.console")
    .to(consoleTransport)
    .apply(extensionFor(WINSTON_TRANSPORT));

  app
    .configure(LoggingBindings.WINSTON_HTTP_ACCESS_LOGGER)
    .to({ format: "combined" });

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch((err) => {
    console.error("Cannot start the application.", err);
    process.exit(1);
  });
}
