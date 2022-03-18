import 'shared/utils/dotenv';
import { RestApi } from 'api/brokers/currency_com/rest-api';
import { PositionApi } from 'api/brokers/currency_com/api/position';
import { AccountApi } from 'api/brokers/currency_com/api/account';
import { OrderSide } from 'api/brokers/currency_com/constants';


const restApi = new RestApi('vEXLx3m2sAxKuGyF', 'E0uSoc&Ppm6+X4J&380IFmB5~DVxRTA7');
const accountApi: AccountApi = new AccountApi(restApi);
const orderApi: PositionApi = new PositionApi(restApi);


accountApi.loadAccounts({})
  .then((data) => {
    console.log(data[0]);

    return data[0].id;
  })
  // .then((accountId) => {
  //   return orderApi.openPosition({
  //     accountId,
  //     symbol: 'ETH/USD_LEVERAGE',
  //     quantity: 1,
  //     side: OrderSide.SELL,
  //   });
  // })
  // .then((position) => {
  //   console.log(position);
  //
  //   setTimeout(() => {
  //     orderApi.closePosition(position.id);
  //   }, 10000);
  // })
  .catch(console.error);


