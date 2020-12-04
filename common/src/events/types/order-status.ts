/**
 *
 */
export enum OrderStatus {
  // when the order has been created by the ticket it is trying to oder has no been reserved
  Created = 'created',
  // the ticket order is trying to reserve has already been reserved, or when user has cancelled the order
  Cancelled = 'cancelled',
  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',
  // the order has reserved the ticker an the user has provided payment successfully
  Complete = 'complete'
}
