import {
  CustomerRepository,
  RoleRepository,
  UserRepository,
} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';

export async function giveEmptyDatabase() {
  const cr = await new CustomerRepository(testdb);
  cr.deleteAll();
  const rr = await new RoleRepository(testdb);
  rr.deleteAll();
  const ur = await new UserRepository(
    testdb,
    async () => new CustomerRepository(testdb),
    async () => new RoleRepository(testdb),
  );
  ur.deleteAll();
}
