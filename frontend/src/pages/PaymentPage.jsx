import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/payment/CheckoutForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { paymentOfContract } from "../redux/actions/clientActions";
import { useParams } from "react-router-dom";

export default function PaymentPage() {
  const dispatch = useDispatch();
  const [response, setResponse] = useState(""); // Start with an empty string
  const { payment } = useSelector((state) => state?.client);
  const { id } = useParams();

  useEffect(() => {
    dispatch(paymentOfContract({ contract_id: id }));
  }, []);

  useEffect(() => {
    if (payment?.client_secret) {
      setResponse(payment.client_secret);
    }
  }, [payment]);

  const stripePromise = loadStripe(
    "pk_test_51LNwdwEhtGsvhu7H9TkyLlTgcztHPnXfhXp1yKSad6bjoM9fsP3dyRyuuB8rhmQAKkjeZa4iC8rgo6WxLWAvlEfL00UuPXV5L9"
  );

  return (
    <>
      {response && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret: response }}>
          <CheckoutForm clientSecret={response} contract_id={id} />
        </Elements>
      )}
    </>
  );
}
