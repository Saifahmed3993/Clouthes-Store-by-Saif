export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
};
