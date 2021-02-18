import { Entity, model, property } from "@loopback/repository";
import { IAuthUser } from "loopback4-authentication";

@model({ settings: { strict: false } })
export class LogIn extends Entity {
  @property({
    type: "string",
    required: true,
  })
  username: string;

  @property({
    type: "string",
    required: true,
  })
  password: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  constructor(data?: Partial<LogIn>) {
    super(data);
  }
}

export interface LogInRelations {
  // describe navigational properties here
}

export type LogInWithRelations = LogIn & LogInRelations;

@model()
export class Token extends Entity {
  @property({ required: true, type: "string" })
  token: string;

  constructor(data?: Partial<Token>) {
    super(data);
  }
}

@model()
export class AuthUser extends Entity implements IAuthUser {
  @property({ type: "string" })
  username: string;

  @property({ type: "string" })
  userId: string;

  @property({ type: "string" })
  role: string;

  @property({ type: "array", itemType: "string" })
  permissions: string[];

  constructor(data?: Partial<AuthUser>) {
    super(data);
  }
}
