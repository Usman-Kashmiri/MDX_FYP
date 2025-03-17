import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = useParams(); 

  const [paymentParams, setPaymentParams] = useState({
    paymentIntent: '',
    paymentIntentClientSecret: '',
    redirectStatus: '',
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    setPaymentParams({
      paymentIntent: searchParams.get('payment_intent') || '',
      paymentIntentClientSecret: searchParams.get('payment_intent_client_secret') || '',
      redirectStatus: searchParams.get('redirect_status') || '',
    });


  }, []);
  if (paymentParams.redirectStatus !== '') {
    navigate(`/dashboard/contract-details-payment/${result}`, {
      state: {
        paymentIntentClientSecret: paymentParams.paymentIntentClientSecret,
        paymentIntent: paymentParams.paymentIntent,
        redirectStatus: paymentParams.redirectStatus,
      },
    });
  }
  return (
    <div>
      <center>waiting....</center>
    </div>
  );
};

export default PaymentSuccess;
