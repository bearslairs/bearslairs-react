import React from 'react';
import Button from 'react-bootstrap/Button';
import {
  CardElement,
  injectStripe
} from 'react-stripe-elements';

/*
 * https://stripe.com/docs/recipes/elements-react
 * https://stripe.com/docs/stripe-js/reference
 * https://stripe.com/docs/payments/accept-a-payment
 */
class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    // User clicked submit
  }

  render() {
    return (
      <div className="checkout">
        <p>enter your payment card details below to complete your reservation</p>
        <CardElement />
        <hr />
        <Button variant="primary" onClick={this.submit}>
          Purchase
        </Button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
