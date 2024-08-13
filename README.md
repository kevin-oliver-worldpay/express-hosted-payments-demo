# Express Checkout Demo

This project demonstrates a flexible checkout process using Express.js and the Express Hosted Payment.

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

## Detailed Flow Explanation (Iframe/Modal Method)

1. **Initiate Purchase**: The user starts on the main page (index.html) where they enter the payment amount and select the iframe checkout method.

2. **TransactionSetup**: 
   - The merchant server sends a TransactionSetup request to the Express API.
   - The ReturnURL is set to "transition.html" for the iframe method.

3. **Receive TransactionSetupID**: The Express API responds with a TransactionSetupID.

4. **Load Hosted Payments in Iframe**: 
   - index.html creates an iframe and loads the Hosted Payments page within it.

5. **Enter Payment Information**: The user enters their payment details in the iframe.

6. **Process Sale**: The Hosted Payments system processes the sale through the Express API.

7. **Load Transition Page**: After processing, the iframe loads transition-complete.html (as specified in the ReturnURL).

8. **Transition Complete Event**: 
   - transition.html sends a "transitionComplete" event.
   - index.html listens for this event.

9. **Load Transaction Complete Page**: 
   - Upon receiving the "transitionComplete" event, index.html initiates a full page load of transaction-complete.html.

10. **Transaction Complete Page Loads**: The browser loads transaction-complete.html.

## Key Points

- The main page (index.html) remains loaded throughout steps 1-8, managing the iframe and listening for events.
- The iframe method allows the checkout process to occur without leaving the merchant's website until the final step.
- transition.html acts as a bridge between the Hosted Payments page and the merchant's transaction complete page.
- The full page redirect to transaction-complete.html only occurs after the payment process is complete (or canceled).

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

## Detailed Flow Explanation (Iframe Method)

1. **Initiate Purchase**: The user starts on the main page (index.html) where they enter the payment amount and select the iframe checkout method.

2. **TransactionSetup**: 
   - The merchant server sends a TransactionSetup request to the Express API.
   - The ReturnURL is set to "tranaction-complete.html" for the redirect method.

3. **Receive TransactionSetupID**: The Express API responds with a TransactionSetupID.

4. **Redirect to Hosted Payments**: 
   - index.html redirects to the Hosted Payments page.

5. **Enter Payment Information**: The user enters their payment details.

6. **Process Sale**: The Hosted Payments system processes the sale through the Express API.

7. **Load Transition Page**: After processing, the Hosted Payments page redirects to transition-complete.html (as specified in the ReturnURL).

## Key Points

- The main page (index.html) redirects to Hosted Payments website.
- The full page redirect to transaction-complete.html only occurs after the payment process is complete (or canceled).

## Prerequisites

Before you begin, ensure you have met the following requirements:

* Node.js (version 12.x or later) and npm installed
* An Element Express account with the necessary credentials

## Setup

1. Clone this repository to your local machine:

   ```
   git clone https://github.com/yourusername/express-checkout-demo.git
   cd express-checkout-demo
   ```

2. Install the project dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory of the project and add your Element Express credentials:

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

   Replace the `your_*` placeholders with your actual Element Express credentials. Adjust the `BASE_URL` if you're deploying to a different environment.

## Running the Application

To start the server, run:

```
npm start
```

The server will start, and you should see a message indicating the server is running.

## Features

- Iframe integration with Express Hosted Payments
- Seamless transition handling
- Customizable CSS for the hosted payment page
- Responsive design using Bootstrap
- Detailed transaction result display

## API Endpoints

- `POST /api/create-checkout`: Creates a new checkout session
  - Body: `{ "amount": "10.00", "referenceNumber": "123456", "method": "iframe" }`
  - Returns: `{ "checkoutUrl": "https://..." }`

## Troubleshooting

If you encounter any issues:

1. Ensure all environment variables in the `.env` file are correctly set, including the `BASE_URL`.
2. Check the console output for any error messages.
3. Verify that you're using a supported version of Node.js.
4. Make sure your Element Express account is properly configured for API access.

## Contributing

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Express.js
- Element Express Payment Gateway
- Bootstrap for responsive design

For more information about the Element Express API, please refer to their official documentation.