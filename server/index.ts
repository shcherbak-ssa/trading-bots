import 'shared/utils/dotenv';
import { RestApi } from 'api/brokers/currency_com/rest-api';
import { PositionApi } from 'api/brokers/currency_com/api/position';
import { AccountApi } from 'api/brokers/currency_com/api/account';
import { OrderSide } from 'api/brokers/currency_com/constants';
import { BrokerAccountType } from 'global/constants';
import { MarketApi } from 'api/brokers/currency_com/api/market';


const restApi = new RestApi('vEXLx3m2sAxKuGyF', 'E0uSoc&Ppm6+X4J&380IFmB5~DVxRTA7');


const accountApi = new AccountApi(restApi);
const positionApi = new PositionApi(restApi);

MarketApi.setup('', restApi)
  .then((api) => {
    return api.loadMarketData('EUR/USD_LEVERAGE');
  })
  .catch(console.error);

// accountApi.loadAccounts({ showZeroBalance: false })
//   .then(([account]) => {
//     console.log(account);
//     return account.id;
//   })
//   .then((accountId) => {
//     return positionApi.openPosition({
//       accountId,
//       quantity: 0.001,
//       symbol: 'ETH/USD_LEVERAGE',
//       side: OrderSide.BUY,
//     });
//   })
//   .then((openPosition) => {
//     return openPosition.id;
//   })
//   .then((positionId) => {
//     setTimeout(() => {
//       positionApi.closePosition(positionId, 'ETH/USD_LEVERAGE');
//     }, 15000);
//   })
//   .catch(console.error);
