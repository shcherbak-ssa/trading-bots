import { BrokerAccountType } from 'global/constants';


export class BrokerRestApi {
  protected accountType: BrokerAccountType = BrokerAccountType.DEMO;


  setAccountType(accountType: BrokerAccountType): BrokerRestApi {
    this.accountType = accountType;

    return this;
  }
}
