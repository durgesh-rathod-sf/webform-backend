import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {SoftDeleteEntity} from 'loopback4-soft-delete';
import {Customer} from './customer.model';
import {Role} from './role.model';

@model()
export class User extends SoftDeleteEntity {
  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;
  @property({
    type: 'string',
  })
  middleName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
  })
  phoneNumber?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  createdOn?: string;

  @property({
    type: 'string',
  })
  modifiedOn?: string;

  @property({
    type: 'boolean',
  })
  isDeleted?: boolean;

  @belongsTo(() => Customer)
  customerId: string;

  @hasOne(() => Role)
  role: Role;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
