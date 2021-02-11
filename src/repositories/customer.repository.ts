import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PsqlDataSource} from '../datasources';
import {Customer, CustomerRelations} from '../models';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {
  constructor(
    @inject('datasources.psql') dataSource: PsqlDataSource,
  ) {
    super(Customer, dataSource);
  }
}
