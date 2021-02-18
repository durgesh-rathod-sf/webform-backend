import { Entity, model, property } from "@loopback/repository";

@model({ settings: { strict: false } })
export class Role extends Entity {
  @property({
    type: "string",
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: "string",
    required: true,
  })
  name: string;

  @property({
    type: "string",
    required: true,
  })
  key: string;

  @property({
    type: "string",
  })
  userId?: string;

  @property({
    type: "array",
    itemType: "string",
  })
  permission: string[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
