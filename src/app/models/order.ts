import { CurrencyPair } from "./currency-pair";

export class Order {

  userId: String;
  
  exchangeName: String;
  
  orderId: String;
  
  entryCurrencyCode: String;
  
  exitCurrencyCode: String;
  
  orderType: String;
  
  orderStatus: String;
  
  orderedAmount: Number;
  
  filledAmount: Number;
  
  price: Number;
  
  timestamp: Number;

  currencyPair() : CurrencyPair {
    return new CurrencyPair(this.entryCurrencyCode, this.exitCurrencyCode);
  }

}
