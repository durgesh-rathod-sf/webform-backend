import { Context, inject } from "@loopback/core";
import {
  FindRoute,
  HttpErrors,
  InvokeMethod,
  InvokeMiddleware,
  MiddlewareSequence,
  ParseParams,
  Reject,
  RequestContext,
  Send,
  SequenceActions,
  SequenceHandler,
} from "@loopback/rest";
import {
  AuthenticateFn,
  AuthenticationBindings,
} from "loopback4-authentication";
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
} from "loopback4-authorization";
import { AuthUser } from "./models";

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn,
    @inject(SequenceActions.INVOKE_MIDDLEWARE)
    protected invokeMiddleware: InvokeMiddleware
  ) {}

  async handle(context: RequestContext): Promise<void> {
    const { request, response } = context;

    const requestTime = Date.now();
    console.log(`Request ${request.method} ${
      request.url
    } started at ${requestTime.toString()}.
    Request Details
    Referer = ${request.headers.referer}
    User-Agent = ${request.headers["user-agent"]}
    Remote Address = ${request.connection.remoteAddress}
    Remote Address (Proxy) = ${request.headers["x-forwarded-for"]}`);
    try {
      // Perform client authentication here
      await this.invokeMiddleware(context);
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      const authUser: AuthUser = await this.authenticateRequest(request);
      const isAccessAllowed: boolean = await this.checkAuthorisation(
        authUser ? authUser.permissions : [],
        request
      );
      if (!isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (error) {
      this.reject(context, error);
    }
  }
}
