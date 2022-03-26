import 'shared/utils/dotenv';
import { RestApi } from 'api/brokers/currency_com/rest-api';
import { runServer } from './app/server';


// const restApi = new RestApi('vEXLx3m2sAxKuGyF', 'E0uSoc&Ppm6+X4J&380IFmB5~DVxRTA7');


runServer()
  .then((app) => {
    app.listen(3333, 'localhost', () => {
      console.log('Server start');
    });
  })
  .catch(console.error)

