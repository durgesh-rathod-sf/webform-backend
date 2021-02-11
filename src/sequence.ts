import { Context, inject} from '@loopback/core';
import {
  InvokeMiddleware,
  MiddlewareSequence,
  RequestContext
} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {AuthClient} from './models';

export class MySequence extends MiddlewareSequence {
  constructor(
    invokeMiddleware: InvokeMiddleware,
    context: Context,
    @inject(AuthenticationBindings.CLIENT_AUTH_ACTION)
    protected authenticateRequestClient: AuthenticateFn<AuthClient>
  ) {
    super(context, invokeMiddleware);
  }

  async handle(context: RequestContext): Promise<void> {
    let request = context.request;
    let requestTime = Date.now();
    console.log(`Request ${request.method} ${
      request.url
    } started at ${requestTime.toString()}.
    Request Details
    Referer = ${request.headers.referer}
    User-Agent = ${request.headers['user-agent']}
    Remote Address = ${request.connection.remoteAddress}
    Remote Address (Proxy) = ${request.headers['x-forwarded-for']}`);
    try {
      // Perform client authentication here
      await this.authenticateRequestClient(request);
    } catch (error) {}

    return super.handle(context);
    // return Promise.resolve();
  }
}
