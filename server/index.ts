import 'shared/utils/dotenv';
import { RestApi } from 'api/brokers/currency_com/rest-api';
import { BrokerAccountType } from 'global/constants';
import { MarketApi } from 'api/brokers/currency_com/api/market';
import { BrokerMarket } from 'api/brokers/currency_com/bot-interface';


const restApi = new RestApi('vEXLx3m2sAxKuGyF', 'E0uSoc&Ppm6+X4J&380IFmB5~DVxRTA7').setAccountType(BrokerAccountType.REAL);


BrokerMarket.setup('ETH/USD_LEVERAGE', restApi)
  .then((brokerMarket) => {
    console.log(brokerMarket.getCurrentPrice());
  })
  .catch(console.error);

