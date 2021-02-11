import {Provider, ValueOrPromise} from '@loopback/core';
import {repository} from '@loopback/repository';
import {VerifyFunction} from 'loopback4-authentication';
import {AuthClientRepository} from '../repositories';

export class ClientPasswordVerifyProvider implements Provider<VerifyFunction.OauthClientPasswordFn>{
  constructor(@repository(AuthClientRepository) public authClientRepository:AuthClientRepository){}
  value(): ValueOrPromise<VerifyFunction.OauthClientPasswordFn> {
    return async (clientId,clientSecret,req) => {
      return this.authClientRepository.findOne({
        where: {
          clientId,
          clientSecret,
        },
      });
    }
  }

}
