import { BrokerAccountType } from 'global/constants';


export class BrokerRestApi {
  protected accountType: BrokerAccountType = BrokerAccountType.DEMO;


  setAccountType(accountType: BrokerAccountType): void {
    this.accountType = accountType;
  }
}
