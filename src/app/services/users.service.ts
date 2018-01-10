import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { User } from '../models/user';
import { ExchangeKey } from '../models/exchange-key';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsersService {

  constructor(private api: ApiService) { }

  get() {
    return Observable.of(this.parseUserList([
      { 
        userName: 'colin', subscriptionKey: '5b6ed6161870659cf7ed2f83b480bace', exchangeKeys: [
          { exchangeName: 'bittrex', secretKey: '0287f4c0888daf1fc88fb8f65f7c2f0f', publicKey: '87d2bcb228b850c7679e66c61bd2a32a' }
        ]
      },
      { 
        userName: 'ryan', subscriptionKey: 'dcfc0a8380b711902655ebbd35a24224', exchangeKeys: [
          { exchangeName: 'bittrex', secretKey: '84e32fb3ae01e4e5f8a0730585c32d2e', publicKey: '87d2bcb228b850c7679e66c61bd2a32a' }
        ]
      },
      { 
        userName: 'wayne', subscriptionKey: '8380b711902655ebbd35a24224dcfc0a', exchangeKeys: [
          { exchangeName: 'binance', secretKey: '0287f4c0888daf1fc88fb8f65f7c2f0f', publicKey: '84e32fb3ae01e4e5f8a0730585c32d2e' }
        ]
      },
      { 
        userName: 'chip', subscriptionKey: '79db62b9b10168b3bf71dd28a469195f', exchangeKeys: [
          { exchangeName: 'bittrex', secretKey: '0287f4c0888daf1fc88fb8f65f7c2f0f', publicKey: '87d2bcb228b850c7679e66c61bd2a32a' },
          { exchangeName: 'binance', secretKey: '84e32fb3ae01e4e5f8a0730585c32d2e', publicKey: '1c79e01bd7b763c5cc607e798c95ddfe' },
        ]
      },
      { 
        userName: 'greg', subscriptionKey: '1021084b030e0508f0265cea164dc722'
      },
    ]));
    // return this.api
    //   .get('/users')
    //   .map(response => {
    //     let users = [];

    //     users = users.concat( response );

    //     console.log(users, response);

    //     return response;
    //   });
  }

  private parseUserList(list): Array<User> {
    let users = [];

    for (let userData of list) {
      users.push(this.createUser(userData));
    }

    return users;
  }

  private createUser(userData): User {
    let user = new User;

    user.userName = userData.userName;
    user.subscriptionKey = userData.subscriptionKey;
    user.id = userData.subscriptionKey;

    for (let exchangeKeyData of userData.exchangeKeys || []) {
      let exchangeKey = new ExchangeKey;

      exchangeKey.exchangeName = exchangeKeyData.exchangeName;
      exchangeKey.publicKey = exchangeKeyData.publicKey;
      exchangeKey.secretKey = exchangeKeyData.secretKey;

      user.exchangeKeys.push(exchangeKey);
    }

    return user;
  }

  find(userId) {
    return this.get()
      .map(users => {
        return users.find(user => user.id == userId);
      });
  }

  put() {
    
  }

}
