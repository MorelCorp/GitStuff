export enum OrderStatus {
  // When the order has been created but the ticket has not been reserved
  Created = 'created',

  // The ticket has already been reserved
  // or the order was cancelled by the user
  // or the order has expired
  Cancelled = 'cancelled',

  //valid order with valid ticket reservation
  AwaitingPayment = 'awaiting:payment',

  // Ther order with valid ticket reservation was succesfully paid for
  Complete = 'complete',
}
