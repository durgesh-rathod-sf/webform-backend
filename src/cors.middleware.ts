import { Next } from "@loopback/core";
import { HttpErrors, Middleware, MiddlewareContext } from "@loopback/rest";

export const corsMiddleware: Middleware = async (
  middlewareCtx: MiddlewareContext,
  next: Next
) => {
  // How to place this outside
  console.log("cors middleware called");
  
  const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN ?? "").split(",");
  const { request } = middlewareCtx;
  if (ALLOWED_ORIGINS.includes(request.headers.host || "")) {
    const result = await next();
    return result;
  } else {
    // Correct HTTP response code?
    throw new HttpErrors[403](
      `Requests from ${request.headers.host} not allowed!`
    );
  }
};
