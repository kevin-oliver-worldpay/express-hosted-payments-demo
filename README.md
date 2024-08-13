# Express Checkout Demo

This project demonstrates a flexible checkout process using Express.js and the Express payment gateway. It supports multiple checkout methods including redirect, iframe, and modal integrations.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* Node.js (version 12.x or later) and npm installed
* An Express account with the necessary credentials

## Setup

1. Clone this repository to your local machine:

   ```
   git clone https://github.com/kevin-oliver-worldpay/express-checkout-demo.git
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

## Usage

1. Open a web browser and navigate to the BASE_URL you set in the .env file (e.g., `http://localhost:3000`).
2. You'll see the checkout demo page with options to enter an amount and select a checkout method.
3. Choose from three checkout methods:
   - Redirect: Full page redirect to the Element Express hosted payment page
   - Iframe: Loads the payment page in an iframe on the same page
   - Modal: Opens the payment page in a modal dialog
4. After completing the payment, you'll be smoothly transitioned to a transaction complete page showing the transaction details.

## Features

- Multiple checkout methods (redirect, iframe, modal)
- Smooth transitions between pages
- Responsive design using Bootstrap
- Detailed transaction result display

## API Endpoints

- `POST /api/create-checkout`: Creates a new checkout session
  - Body: `{ "amount": "10.00", "referenceNumber": "123456", "method": "redirect" }`
  - Returns: `{ "checkoutUrl": "https://..." }`

## File Structure

- `server.js`: Main server file
- `public/index.html`: Main checkout page
- `public/transaction-complete.html`: Transaction result page
- `public/transition.html`: Intermediary page for smooth transitions in iframe and modal modes

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