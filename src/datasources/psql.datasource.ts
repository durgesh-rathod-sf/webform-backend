import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'psql',
  connector: 'postgresql',
  url: 'postgres://root:password@localhost/root',
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'password',
  database: 'db'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PsqlDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'psql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.psql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
