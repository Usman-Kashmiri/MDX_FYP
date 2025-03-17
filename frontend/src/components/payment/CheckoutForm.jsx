import React, { useState } from "react";
import {
  CardElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { paymentOfContract } from "../../redux/actions/clientActions";

const CheckoutForm = ({
  clientSecret,
  contract_id = 31,
  contractDetails = [],
}) => {
  let baseUrl = window.location.origin;
  const dispatch = useDispatch();
  const elements = useElements();
  const { user } = useSelector((state) => state?.auth);
  const stripe = useStripe();
  const [amount, setAmount] = useState(""); // State to store the input amount

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${baseUrl}/dashboard/contract-details-payment/${contract_id}`,
        // return_url: if_required,
        payment_method_data: {
          billing_details: {
            email: user.userData.email,
          },
        },
      },

      metadata: {
        contract_id: contract_id,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log(result);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="paymentForm">
      <div className="d-flex w-100 mb-3 justify-content-between">
        <span>Pay Amount</span>
        <span>
          <strong>{contractDetails.fees_amount}</strong>
        </span>
      </div>
      <div className="cardelement">
        <PaymentElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "16px",
                color: "#000",
                border: "2px solid #000",
              },
            },
          }}
        />
      </div>
      <div className="d-flex flex-row align-self-end">
        <button
          type="submit"
          className="primary-btn w-100 mt-4 text-capitalize"
        >
          Submit Payment
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
