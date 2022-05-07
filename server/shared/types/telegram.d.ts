import { IncomeMessage } from 'api/telegram/types';


export type TelegramIncomeMessage = {
  token: string;
  update_id: number;
  message: IncomeMessage;
}
