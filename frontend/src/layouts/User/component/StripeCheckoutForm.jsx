import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_51RihUMQ1nvt86rfmgAyf52c8e3iUK1gd3PuGxth8Cgng0hxm1dhdvj1B5fCK3zZnXXPVAdc2Qyaq6H9NgxD1Pwdt006VPZkX34");

function CheckoutForm({ clientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });
    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      onSuccess(result.paymentIntent);
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl"
      >
        {processing ? "Processing..." : "Pay with Stripe"}
      </button>
    </form>
  );
}

export default function StripeCheckoutForm({ clientSecret, onSuccess }) {
  if (!clientSecret) return null;
  const appearance = {
    theme: 'stripe', // hoặc 'night', 'flat', 'none'
    variables: {
      colorPrimary: '#a259ff',
      colorBackground: '#1a005f',
      colorText: '#fff',
      colorDanger: '#ff3860',
      fontFamily: 'inherit',
      borderRadius: '12px',
    },
    rules: {
      '.Input': {
        border: '1px solid #a259ff',
      },
      '.Label': {
        color: '#fff',
      },
    },
  };
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
        locale: "en",
      }}
    >
      <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} />
    </Elements>
  );
}