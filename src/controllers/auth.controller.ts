// Uncomment these imports to begin using these cool features!

import { repository } from "@loopback/repository";
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  response,
} from "@loopback/rest";
import { AuthUser, LogIn, Token, User } from "../models";
import { UserRepository } from "../repositories";
import * as jwt from "jsonwebtoken";
// import {inject} from '@loopback/core';

export class AuthController {
  constructor(@repository(UserRepository) public userRepo: UserRepository) {}

  @post("/auth/login")
  @response(200, {
    description: "User model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  async login(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(LogIn, { title: "LogIn" }),
        },
      },
    })
    cred: LogIn
  ): Promise<Token> {
    const user = await this.userRepo.findOne({
      where: {
        and: [{ username: cred.username }, { password: cred.password }],
      },
    });
    if (!user) {
      throw new HttpErrors[401]("Invalid Username of Password");
    }
    return this.createJWTToken(user);
  }
  async createJWTToken(user: User): Promise<Token> {
    const authUser = new AuthUser();
    const userRole = await this.userRepo.role(user.id).get();
    const role = userRole.name;
    authUser.userId = user.id;
    authUser.role = role;
    authUser.username = user.username;
    authUser.permissions = userRole.permission;
    const token: string = jwt.sign(
      authUser.toJSON(),
      process.env.SECRET_KEY as string,
      {
        expiresIn: "60m",
        issuer: process.env.ISSUER,
      }
    );

    const tokenObj = new Token();
    tokenObj.token = token;
    return Promise.resolve(tokenObj);
  }
}
