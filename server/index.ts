import 'shared/utils/dotenv';
import { RestApi } from 'api/brokers/currency_com/rest-api';
import { BrokerAccountType } from 'global/constants';
import { WsApi } from 'api/brokers/currency_com/ws-api';
import { EndpointSubscription } from 'api/brokers/currency_com/constants';
import type { MarketPriceSubscribePayload, MarketPriceSubscribeResponsePayload } from 'api/brokers/currency_com/types';
import type { WsSubscribeResponse } from 'api/brokers/currency_com/types';
import { BrokerMarket } from 'api/brokers/currency_com/bot-interface';


const restApi = new RestApi('vEXLx3m2sAxKuGyF', 'E0uSoc&Ppm6+X4J&380IFmB5~DVxRTA7').setAccountType(BrokerAccountType.REAL);

BrokerMarket.setup('ETH/USD_LEVERAGE', restApi)
  .then(() => console.log('ok'))
  .catch(console.error)
