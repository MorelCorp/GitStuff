export enum OrderStatus {
  // When the order has been created but the stuff has not been reserved
  Created = 'created',

  // The stuff has already been reserved
  // or the order was cancelled by the user
  // or the order has expired
  Cancelled = 'cancelled',

  //valid order with valid stuff reservation
  AwaitingPayment = 'awaiting:payment',

  // Ther order with valid stuff reservation was succesfully paid for
  Complete = 'complete',
}
