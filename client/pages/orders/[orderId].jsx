import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useRequest } from "../../hooks";
import Router from "next/router";

const STRIPE_PUBLIC_KEY =
  "pk_test_51Mvaq3SInZQdTj6YxMiq3sH7SFTPdhJVQ8KYGKtmbvI1Nlqco2hsM6oMh6F0h8vV7bJFdRucWqxtDneaxhCKroO4004OlpAALH";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));

      return msLeft;
    };

    calculateTimeLeft();

    const timerId = setInterval(calculateTimeLeft, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timerId);
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired!</div>;
  }

  return (
    <div>
      {timeLeft} seconds until order expires
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={STRIPE_PUBLIC_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data.data };
};

export default OrderShow;
