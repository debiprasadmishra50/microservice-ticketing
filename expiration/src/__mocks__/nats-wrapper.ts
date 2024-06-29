export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      // @ts-ignore
      (subject: string, data: string, callback: () => void) => {
        callback();
      }
    ),
  },
};
