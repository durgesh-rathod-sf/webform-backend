import { BootMixin } from "@loopback/boot";
import { ApplicationConfig } from "@loopback/core";
import { RepositoryMixin } from "@loopback/repository";
import { RestApplication, SequenceActions } from "@loopback/rest";
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from "@loopback/rest-explorer";
import { ServiceMixin } from "@loopback/service-proxy";
import * as dotenv from "dotenv";
import path from "path";
import { MySequence } from "./sequence";
import { LoggingComponent } from "@loopback/logging";
import { AuthenticationComponent, Strategies } from "loopback4-authentication";
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from "loopback4-authorization";
import { TokenVerifyProvider } from "./provider/TokenVerifier.provider";
import { corsMiddleware } from "./cors.middleware";
import { WinstonLogComponent } from "./components/winston.component";
export { ApplicationConfig };

export class WebformBackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication))
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    dotenv.config();
    console.log("application.ts called");

    this.middleware(corsMiddleware);
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static("/", path.join(__dirname, "../public"));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: "/explorer",
    });
    this.component(RestExplorerComponent);

    // adding logging component
    this.component(LoggingComponent);

    // Add authentication component
    this.component(AuthenticationComponent);
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      TokenVerifyProvider
    );

    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ["/ping", "/explorer", "/auth/login"],
    });
    this.component(AuthorizationComponent);
    this.component(WinstonLogComponent);
    this.projectRoot = __dirname;

    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ["controllers"],
        extensions: [".controller.js"],
        nested: true,
      },
    };
  }
}
