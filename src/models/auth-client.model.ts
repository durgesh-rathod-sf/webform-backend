import {Entity, model, property} from '@loopback/repository';

@model()
export class AuthClient extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  clientId: string;

  @property({
    type: 'string',
    required: true,
  })
  clientSecret: string;

  @property({
    type: 'array',
    itemType: 'number',
  })
  userIds?: number[];


  constructor(data?: Partial<AuthClient>) {
    super(data);
  }
}

export interface AuthClientRelations {
  // describe navigational properties here
}

export type AuthClientWithRelations = AuthClient & AuthClientRelations;
