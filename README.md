# Express Hosted Payments Demo

This project demonstrates a flexible checkout process using Express.js and Express Hosted Payments, supporting both iframe/modal and redirect methods.

## Checkout Flow (Iframe/Modal Method)

```
Customer Browser (index.html)     Merchant Server     Hosted Payments        Express API
        |                               |                    |                    |
        | 1. Init Purchase (iframe)     |                    |                    |
        |-----------------------------> |                    |                    |
        |                               | 2. TransactionSetup|                    |
        |                               |----------------------------------->     |
        |                               |                    |                    |
        |                               | 3. TransactionSetupID                   |
        |                               | <-----------------------------------|   |
        |                               |                    |                    |
        | 4. Load iframe with Hosted Payments URL            |                    |
        | <-----------------------------|--------------------|                    |
        |                               |                    |                    |
        | 5. Enter Card Info            |                    |                    |
        | -------------------------------------------------> |                    |
        |                               |                    |                    |
        |                               |                    | 6. Process Sale    |
        |                               |                    |------------------> |
        |                               |                    |                    |
        | 7. Load transition.html in iframe                  |                    |
        | <------------------------------------------------- |                    |
        |                               |                    |                    |
        | 8. transition.html sends "transitionComplete" event|                    |
        |-------.                       |                    |                    |
        |       | (index.html listens)  |                    |                    |
        |<------'                       |                    |                    |
        |                               |                    |                    |
        | 9. index.html loads transaction-complete.html      |                    |
        |-------.                       |                    |                    |
        |       | (full page load)      |                    |                    |
        |<------'                       |                    |                    |
        |                               |                    |                    |
```

### Key Points (Iframe/Modal Method):
- The main page (index.html) manages the iframe and listens for events.
- Checkout occurs within the merchant's website until the final step.
- transition.html bridges the Hosted Payments page and the merchant's transaction complete page.
- Full page redirect to transaction-complete.html occurs after payment completion or cancellation.

## Checkout Flow (Redirect Method)

```
Customer Browser (index.html)     Merchant Server     Hosted Payments        Express API
        |                               |                    |                    |
        | 1. Init Purchase (index)      |                    |                    |
        |-----------------------------> |                    |                    |
        |                               | 2. TransactionSetup|                    |
        |                               |----------------------------------->     |
        |                               |                    |                    |
        |                               | 3. TransactionSetupID                   |
        |                               | <-----------------------------------|   |
        |                               |                    |                    |
        | 4. Load index with Hosted Payments URL             |                    |
        | <-----------------------------|--------------------|                    |
        |                               |                    |                    |
        | 5. Enter Card Info            |                    |                    |
        | -------------------------------------------------> |                    |
        |                               |                    |                    |
        |                               |                    | 6. Process Sale    |
        |                               |                    |------------------> |
        |                               |                    |                    |
        | 7. Load transaction-complete.html                  |                    |
        | <------------------------------------------------- |                    |
        |                               |                    |                    |
```

### Key Points (Redirect Method):
- The main page (index.html) redirects to the Hosted Payments website.
- Full page redirect to transaction-complete.html occurs after payment completion or cancellation.

## Prerequisites

- Node.js (version 12.x or later) and npm
- An Element Express account with necessary credentials

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/kevin-oliver-worldpay/express-checkout-demo.git
   cd express-checkout-demo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Element Express credentials:
   ```
   ACCOUNT_ID=your_account_id
   ACCOUNT_TOKEN=your_account_token
   ACCEPTOR_ID=your_acceptor_id
   APPLICATION_ID=your_application_id
   APPLICATION_NAME=your_application_name
   APPLICATION_VERSION=your_application_version
   PORT=3000
   BASE_URL=http://localhost:3000
   ```

## Running the Application

Start the server:
```
npm start
```

## Features

- Iframe and redirect integration with Express Hosted Payments
- Seamless transition handling
- Customizable CSS for the hosted payment page
- Responsive design using Bootstrap
- Detailed transaction result display

## API Endpoints

- `POST /api/create-checkout`: Creates a new checkout session
  - Body: `{ "amount": "10.00", "referenceNumber": "123456", "method": "iframe" }`
  - Returns: `{ "checkoutUrl": "https://..." }`

## Troubleshooting

1. Verify environment variables in the `.env` file.
2. Check console output for error messages.
3. Ensure you're using a supported Node.js version.
4. Confirm your Element Express account is configured for API access.

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Express.js
- Element Express Payment Gateway
- Bootstrap for responsive design
- Benjamin Rice for just what a great colleague he is!

For more information about the Element Express API, please refer to their official documentation.