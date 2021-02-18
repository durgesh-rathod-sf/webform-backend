import { Provider, ValueOrPromise } from "@loopback/core";
import { repository } from "@loopback/repository";
import { verify } from "jsonwebtoken";
import { VerifyFunction } from "loopback4-authentication";
import { AuthUser } from "../models";
import { AuthClientRepository } from "../repositories";

export class TokenVerifyProvider implements Provider<VerifyFunction.BearerFn> {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository
  ) {}
  value(): ValueOrPromise<VerifyFunction.BearerFn> {
    return async (token: string) => {
      const authUser = verify(token, process.env.SECRET_KEY as string, {
        issuer: process.env.ISSUER,
      }) as AuthUser;
      return Promise.resolve(authUser);
    };
  }
}
