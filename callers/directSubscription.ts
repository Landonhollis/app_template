
//----------from claude---------------

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_...');

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // This is where the magic happens - Stripe Elements securely collects card data
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { email: user.email }
      }
    });

    if (!error) {
      // Payment succeeded, create subscription on backend
      await createSubscription(paymentIntent.payment_method);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement /> {/* This is Stripe's secure card input */}
      <button type="submit">Subscribe</button>
    </form>
  );
}

// Wrap with Elements provider
<Elements stripe={stripePromise}>
  <CheckoutForm clientSecret={clientSecret} />
</Elements>










//----------------reusable functions------------------

const createCustomer = async (userId: string) => {

}


//----------------main functions------------------


const subscribeToFree = async (userId: string) => {
  
}

const subscribeToBasic = async (userId: string) => {

}

const subscribeToPro = async (userId: string) => {

}

//----------------export functions------------------
export { 
  subscribeToFree, 
  subscribeToBasic, 
  subscribeToPro, 
 }
