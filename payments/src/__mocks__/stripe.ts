export const stripe = {
  paymentMethods: {
    create: jest.fn().mockResolvedValue({id: "random-payment-method-id"}),
  },
  paymentIntents: {
    create: jest.fn().mockResolvedValue({id: "random-payment-intent-id"}),
  },
};
