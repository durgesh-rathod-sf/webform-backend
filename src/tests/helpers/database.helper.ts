import {
  CustomerRepository,
  RoleRepository,
  UserRepository,
} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';

export async function giveEmptyDatabase() {
  let cr = await new CustomerRepository(testdb);
  cr.deleteAll();
  let rr = await new RoleRepository(testdb);
  rr.deleteAll();
  let ur = await new UserRepository(
    testdb,
    async () => new CustomerRepository(testdb),
    async () => new RoleRepository(testdb),
  );
  ur.deleteAll();
}
