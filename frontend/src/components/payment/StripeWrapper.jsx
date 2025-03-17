import React from 'react';
import { Elements,loadStripe } from '@stripe/react-stripe-js'; 

const stripePromise = loadStripe('pk_test_51LNwdwEhtGsvhu7H9TkyLlTgcztHPnXfhXp1yKSad6bjoM9fsP3dyRyuuB8rhmQAKkjeZa4iC8rgo6WxLWAvlEfL00UuPXV5L9'); // Replace with your actual publishable key

const StripeWrapper = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

export default StripeWrapper;
